#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const flux_pwa_generator = (await import("../../flux-pwa-generator/src/FluxPwaGenerator.mjs")).FluxPwaGenerator.new(
        (await import("../../flux-localization-api/src/FluxLocalizationApi.mjs")).FluxLocalizationApi.new()
    );

    const web_root = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
    const pwa_folder = join(web_root, "Pwa");
    const manifest_json_file = join(pwa_folder, "manifest.json");

    await flux_pwa_generator.generateManifestJsons(
        join(pwa_folder, "manifest-template.json"),
        manifest_json_file,
        join(web_root, "Localization")
    );

    await flux_pwa_generator.generateIndexHtmls(
        manifest_json_file,
        join(web_root, "index.html"),
        "Pwa/manifest.json",
        "index.mjs"
    );
} catch (error) {
    console.error(error);

    if (flux_shutdown_handler !== null) {
        await flux_shutdown_handler.shutdown(
            1
        );
    } else {
        process.exit(1);
    }
}
