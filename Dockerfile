FROM node:19-alpine AS build

COPY package*.json /build/flux-studis-selfservice-frontend-build/
COPY bin/install-dependencies.sh /build/flux-studis-selfservice-frontend-build/bin/install-dependencies.sh
RUN (cd /build/flux-studis-selfservice-frontend-build && npm ci --omit=dev)

COPY . /build/flux-studis-selfservice-frontend-build/node_modules/flux-studis-selfservice-frontend

RUN /build/flux-studis-selfservice-frontend-build/node_modules/flux-studis-selfservice-frontend/bin/generate-pwa.mjs

RUN cp -L -R /build/flux-studis-selfservice-frontend-build/node_modules/flux-studis-selfservice-frontend/src /build/flux-studis-selfservice-frontend && rm -rf /build/flux-studis-selfservice-frontend-build

FROM scratch

COPY --from=build /build /
