#!/usr/bin/env sh

set -e

if [ "`basename "$(realpath ..)"`" = "node_modules" ]; then
    node_modules=".."
else 
    node_modules="node_modules"
fi

(mkdir -p $node_modules/flux-color-scheme-api && cd $node_modules/flux-color-scheme-api && wget -O - https://github.com/fluxfw/flux-color-scheme-api/archive/refs/tags/v2022-10-13-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-css-api && cd $node_modules/flux-css-api && wget -O - https://github.com/fluxfw/flux-css-api/archive/refs/tags/v2022-10-03-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-fetch-api && cd $node_modules/flux-fetch-api && wget -O - https://github.com/fluxfw/flux-fetch-api/archive/refs/tags/v2022-09-30-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-json-api && cd $node_modules/flux-json-api && wget -O - https://github.com/fluxfw/flux-json-api/archive/refs/tags/v2022-10-03-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-loading-api && cd $node_modules/flux-loading-api && wget -O - https://github.com/fluxfw/flux-loading-api/archive/refs/tags/v2022-10-13-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-localization-api && cd $node_modules/flux-localization-api && wget -O - https://github.com/fluxfw/flux-localization-api/archive/refs/tags/v2022-10-13-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-pwa-api && cd $node_modules/flux-pwa-api && wget -O - https://github.com/fluxfw/flux-pwa-api/archive/refs/tags/v2022-10-10-1.tar.gz | tar -xz --strip-components=1)

(mkdir -p $node_modules/flux-settings-api && cd $node_modules/flux-settings-api && wget -O - https://github.com/fluxfw/flux-settings-api/archive/refs/tags/v2022-10-03-1.tar.gz | tar -xz --strip-components=1)
