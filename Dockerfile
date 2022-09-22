FROM node:18-alpine AS build

COPY package*.json /build/flux-studies-selfservice-frontend/
RUN (cd /build/flux-studies-selfservice-frontend && npm ci --omit=dev)

COPY . /build/flux-studies-selfservice-frontend

FROM nginx:mainline-alpine

RUN sed -i "s/}/\n    application\/javascript mjs;\n}/" /etc/nginx/mime.types

COPY --from=build /build /usr/share/nginx/html

ARG COMMIT_SHA
LABEL org.opencontainers.image.revision="$COMMIT_SHA"
