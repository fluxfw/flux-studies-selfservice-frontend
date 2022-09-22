FROM node:18-alpine AS build

COPY package*.json /build/flux-studies-selfservice-frontend/
RUN (cd /build/flux-studies-selfservice-frontend && npm ci --omit=dev)

COPY . /build/flux-studies-selfservice-frontend

FROM nginx:mainline-alpine

RUN unlink /etc/nginx/conf.d/default.conf

RUN sed -i "s/}/\n    application\/javascript mjs;\n}/" /etc/nginx/mime.types

RUN echo "server_tokens off;\
\
server {\
	listen 80;\
\
	index index.html;\
\
    location /flux-css-api {\
        alias /flux-studies-selfservice-frontend/node_modules/flux-css-api;\
    }\
\
    location /flux-fetch-api {\
        alias /flux-studies-selfservice-frontend/node_modules/flux-fetch-api;\
    }\
\
    location /flux-studies-selfservice-frontend {\
        alias /flux-studies-selfservice-frontend;\
    }\
\
    location / {\
        return 302 flux-studies-selfservice-frontend/src;\
    }\
}" > /etc/nginx/conf.d/flux-studies-selfservice-frontend.conf

COPY --from=build /build /

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
