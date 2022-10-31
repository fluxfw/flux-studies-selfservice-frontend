FROM node:19-alpine AS build

COPY package*.json /build/flux-studies-selfservice-frontend-build/
COPY bin/install-dependencies.sh /build/flux-studies-selfservice-frontend-build/bin/install-dependencies.sh
RUN (cd /build/flux-studies-selfservice-frontend-build && npm ci --omit=dev)

COPY . /build/flux-studies-selfservice-frontend-build/node_modules/flux-studies-selfservice-frontend

RUN /build/flux-studies-selfservice-frontend-build/node_modules/flux-studies-selfservice-frontend/bin/generate-pwa.mjs

RUN cp -L -R /build/flux-studies-selfservice-frontend-build/node_modules/flux-studies-selfservice-frontend/src /build/flux-studies-selfservice-frontend && rm -rf /build/flux-studies-selfservice-frontend-build

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
        root /flux-studies-selfservice-frontend;\n\
    }\n\
}" > /etc/nginx/conf.d/flux-studies-selfservice-frontend.conf

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
