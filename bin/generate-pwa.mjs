#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

try {
    const shutdown_handler_api = (await import("../../flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs")).ShutdownHandlerApi.new();
    await shutdown_handler_api.init();
    await shutdown_handler_api.getShutdownHandler();

    const fetch_api = (await import("../../flux-fetch-api/src/Adapter/Api/FetchApi.mjs")).FetchApi.new();
    await fetch_api.init();

    const json_api = (await import("../../flux-json-api/src/Adapter/Api/JsonApi.mjs")).JsonApi.new(
        fetch_api
    );
    await json_api.init();

    const pwa_generator_api = (await import("../../flux-pwa-generator-api/src/Adapter/Api/PwaGeneratorApi.mjs")).PwaGeneratorApi.new(
        json_api
    );
    await pwa_generator_api.init();

    const __dirname = dirname(fileURLToPath(import.meta.url));

    const web_root = join(__dirname, "..", "src");
    const manifest_json_file = join(web_root, "Adapter", "Pwa", "manifest.json");

    await pwa_generator_api.generateManifestJsons(
        manifest_json_file,
        join(web_root, "Adapter", "Localization")
    );

    await pwa_generator_api.generateIndexHtmls(
        manifest_json_file,
        join(web_root, "index.html"),
        "Adapter/Pwa/manifest.json",
        "index.mjs"
    );
} catch (error) {
    console.error(error);

    process.exit(1);
}
