#!/usr/bin/env sh

set -e

root="`dirname "$0"`/.."
libs="$root/.."

checkAlreadyInstalled() {
    if [ `ls "$libs" | wc -l` != "1" ]; then
        echo "Already installed"
        exit 1
    fi
}

installLibrary() {
    (mkdir -p "$libs/$1" && cd "$libs/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

checkAlreadyInstalled

installLibrary flux-color-scheme-api https://github.com/fluxfw/flux-color-scheme-api/archive/refs/tags/v2022-12-20-1.tar.gz

installLibrary flux-css-api https://github.com/fluxfw/flux-css-api/archive/refs/tags/v2023-02-02-1.tar.gz

installLibrary flux-hash-api https://github.com/fluxfw/flux-hash-api/archive/refs/tags/v2023-01-06-2.tar.gz

installLibrary flux-http-api https://github.com/fluxfw/flux-http-api/archive/refs/tags/v2023-02-02-2.tar.gz

installLibrary flux-json-api https://github.com/fluxfw/flux-json-api/archive/refs/tags/v2023-02-02-1.tar.gz

installLibrary flux-loading-api https://github.com/fluxfw/flux-loading-api/archive/refs/tags/v2022-12-08-1.tar.gz

installLibrary flux-localization-api https://github.com/fluxfw/flux-localization-api/archive/refs/tags/v2023-01-03-1.tar.gz

installLibrary flux-pwa-api https://github.com/fluxfw/flux-pwa-api/archive/refs/tags/v2022-12-20-1.tar.gz

installLibrary flux-pwa-generator-api https://github.com/fluxfw/flux-pwa-generator-api/archive/refs/tags/v2023-02-03-1.tar.gz

installLibrary flux-settings-api https://github.com/fluxfw/flux-settings-api/archive/refs/tags/v2023-01-31-1.tar.gz

installLibrary flux-shutdown-handler-api https://github.com/fluxfw/flux-shutdown-handler-api/archive/refs/tags/v2022-12-08-1.tar.gz
