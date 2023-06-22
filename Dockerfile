FROM node:20-alpine AS build

RUN apk add --no-cache imagemagick

COPY bin/install-libraries.sh /build/flux-studis-selfservice-frontend-build/libs/flux-studis-selfservice-frontend/bin/install-libraries.sh
RUN /build/flux-studis-selfservice-frontend-build/libs/flux-studis-selfservice-frontend/bin/install-libraries.sh

COPY . /build/flux-studis-selfservice-frontend-build/libs/flux-studis-selfservice-frontend

RUN /build/flux-studis-selfservice-frontend-build/libs/flux-studis-selfservice-frontend/bin/generate-pwa.mjs

RUN cp -L -R /build/flux-studis-selfservice-frontend-build/libs/flux-studis-selfservice-frontend/src /build/flux-studis-selfservice-frontend && rm -rf /build/flux-studis-selfservice-frontend-build

RUN (cd /build && tar -czf build.tar.gz flux-studis-selfservice-frontend && rm -rf flux-studis-selfservice-frontend)

FROM scratch

COPY --from=build /build /
