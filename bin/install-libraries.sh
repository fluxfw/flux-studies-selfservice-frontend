#!/usr/bin/env sh

set -e

bin="`dirname "$0"`"
root="$bin/.."
libs="$root/.."

checkAlreadyInstalled() {
    if [ `ls "$libs" | wc -l` != "1" ]; then
        echo "Already installed" >&2
        exit 1
    fi
}

installLibrary() {
    (mkdir -p "$libs/$1" && cd "$libs/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

checkAlreadyInstalled

installLibrary flux-button-group https://github.com/fluxfw/flux-button-group/archive/refs/tags/v2023-05-23-1.tar.gz

installLibrary flux-color-scheme https://github.com/fluxfw/flux-color-scheme/archive/refs/tags/v2023-04-24-1.tar.gz

installLibrary flux-css-api https://github.com/fluxfw/flux-css-api/archive/refs/tags/v2023-04-11-1.tar.gz

installLibrary flux-http-api https://github.com/fluxfw/flux-http-api/archive/refs/tags/v2023-04-20-1.tar.gz

installLibrary flux-loading-spinner https://github.com/fluxfw/flux-loading-spinner/archive/refs/tags/v2023-03-29-1.tar.gz

installLibrary flux-localization-api https://github.com/fluxfw/flux-localization-api/archive/refs/tags/v2023-05-04-1.tar.gz

installLibrary flux-overlay https://github.com/fluxfw/flux-overlay/archive/refs/tags/v2023-05-16-2.tar.gz

installLibrary flux-pwa-api https://github.com/fluxfw/flux-pwa-api/archive/refs/tags/v2023-05-01-1.tar.gz

installLibrary flux-pwa-generator https://github.com/fluxfw/flux-pwa-generator/archive/refs/tags/v2023-04-24-1.tar.gz

installLibrary flux-settings-api https://github.com/fluxfw/flux-settings-api/archive/refs/tags/v2023-04-11-1.tar.gz

installLibrary flux-shutdown-handler https://github.com/fluxfw/flux-shutdown-handler/archive/refs/tags/v2023-03-16-1.tar.gz
