# flux-studies-selfservice-frontend

```Dockerfile
RUN (mkdir -p /path/to/web-root && cd /path/to/web-root && wget -O - https://github.com/fluxfw/flux-studies-selfservice-frontend/releases/download/vYYYY-MM-DD-I/flux-studies-selfservice-frontend-vYYYY-MM-DD-I-build.tar.gz | tar -xz --strip-components=1)
```

```shell
docker run --rm -p [%host_ip%:]80:80 fluxfw/flux-studies-selfservice-frontend:vYYYY-MM-DD-I
```
