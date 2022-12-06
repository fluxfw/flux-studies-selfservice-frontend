#!/usr/bin/env sh

set -e

installDependency() {
    if [ "`basename "$(realpath ..)"`" = "node_modules" ]; then
        node_modules=".."
    else 
        node_modules="node_modules"
    fi

    (mkdir -p "$node_modules/$1" && cd "$node_modules/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

installDependency flux-color-scheme-api https://github.com/fluxfw/flux-color-scheme-api/archive/refs/tags/v2022-12-05-1.tar.gz

installDependency flux-css-api https://github.com/fluxfw/flux-css-api/archive/refs/tags/v2022-11-24-1.tar.gz

installDependency flux-fetch-api https://github.com/fluxfw/flux-fetch-api/archive/refs/tags/v2022-11-24-1.tar.gz

installDependency flux-json-api https://github.com/fluxfw/flux-json-api/archive/refs/tags/v2022-11-24-1.tar.gz

installDependency flux-loading-api https://github.com/fluxfw/flux-loading-api/archive/refs/tags/v2022-12-06-1.tar.gz

installDependency flux-localization-api https://github.com/fluxfw/flux-localization-api/archive/refs/tags/v2022-12-06-1.tar.gz

installDependency flux-pwa-api https://github.com/fluxfw/flux-pwa-api/archive/refs/tags/v2022-12-06-1.tar.gz

installDependency flux-pwa-generator-api https://github.com/fluxfw/flux-pwa-generator-api/archive/refs/tags/v2022-11-24-1.tar.gz

installDependency flux-settings-api https://github.com/fluxfw/flux-settings-api/archive/refs/tags/v2022-12-05-2.tar.gz

installDependency flux-shutdown-handler-api https://github.com/fluxfw/flux-shutdown-handler-api/archive/refs/tags/v2022-11-24-1.tar.gz
