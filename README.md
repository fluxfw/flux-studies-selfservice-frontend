# flux-studis-selfservice-frontend

*You need to fill placeholders (Wrapped in `%`), create secret files and adjust to your needs (Applies everywhere)*

```Dockerfile
RUN (mkdir -p /path/to/web-root && cd /path/to/web-root && wget -O - https://github.com/fluxfw/flux-studis-selfservice-frontend/releases/download/%version%/flux-studis-selfservice-frontend-%version%-build.tar.gz | tar -xz --strip-components=1)
```
