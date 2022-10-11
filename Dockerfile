FROM node:18-alpine AS build

COPY package*.json /build/flux-studies-selfservice-frontend/
COPY bin/install-dependencies.sh /build/flux-studies-selfservice-frontend/bin/install-dependencies.sh
RUN (cd /build/flux-studies-selfservice-frontend && npm ci --omit=dev)

COPY . /build/flux-studies-selfservice-frontend

RUN mkdir -p /build/flux-studies-selfservice-frontend/node_modules/flux-studies-selfservice-frontend && mv /build/flux-studies-selfservice-frontend/src /build/flux-studies-selfservice-frontend/node_modules/flux-studies-selfservice-frontend/src

FROM nginx:mainline-alpine

RUN unlink /etc/nginx/conf.d/default.conf

RUN sed -i "s/}/\n    application\/javascript mjs;\n}/" /etc/nginx/mime.types

RUN echo -e "server_tokens off;\n\
\n\
server {\n\
	listen 80;\n\
\n\
	index index.html;\n\
\n\
    location / {\n\
        root /flux-studies-selfservice-frontend/node_modules/flux-studies-selfservice-frontend/src;\n\
    }\n\
}" > /etc/nginx/conf.d/flux-studies-selfservice-frontend.conf

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
