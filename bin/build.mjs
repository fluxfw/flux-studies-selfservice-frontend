#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { LOCALIZATION_MODULE } from "../src/Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS_STUDIS_SELFSERVICE_FRONTENDSTUDIS_SELFSERVICE_FRONTEND } from "../src/Localization/LOCALIZATIONS.mjs";
import { MANIFEST_TEMPLATE } from "../src/Manifest/manifest-template.mjs";
import { basename, dirname, extname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const mode = process.argv[2] ?? null;
    if (![
        "prod",
        "dev"
    ].includes(mode)) {
        throw new Error("Please pass prod or dev");
    }

    const bin_folder = dirname(fileURLToPath(import.meta.url));
    const root_folder = join(bin_folder, "..");
    const libs_folder = join(root_folder, "..");
    const src_folder = join(root_folder, "src");
    const icon_folder = join(src_folder, "Icon");
    const manifest_folder = join(src_folder, "Manifest");
    const index_template_html_file = join(src_folder, "index-template.html");
    const index_html_file = join(src_folder, "index.html");
    const icon_template_file = join(icon_folder, "icon-template.svg");
    const manifest_json_file = join(manifest_folder, "manifest.json");
    const libs_file_filter = root_file => root_file.startsWith("flux-") ? (root_file.includes("/bin/") || root_file.includes("/src/")) && !root_file.startsWith("flux-pwa-generator/") && !root_file.endsWith("/bin/build.mjs") && ![
        ".md",
        ".sh"
    ].includes(extname(root_file)) && !basename(root_file).includes("-template") : true;

    const flux_localization_api = await (await import("../../flux-localization-api/src/FluxLocalizationApi.mjs")).FluxLocalizationApi.new();

    await flux_localization_api.addModule(
        LOCALIZATION_MODULE,
        LOCALIZATIONS_STUDIS_SELFSERVICE_FRONTENDSTUDIS_SELFSERVICE_FRONTEND
    );

    const flux_pwa_generator = (await import("../../flux-pwa-generator/src/FluxPwaGenerator.mjs")).FluxPwaGenerator.new(
        flux_localization_api
    );

    await flux_pwa_generator.generateManifestJsons(
        MANIFEST_TEMPLATE,
        manifest_json_file,
        LOCALIZATION_MODULE
    );

    await flux_pwa_generator.generateIcons(
        icon_template_file,
        manifest_json_file
    );

    await flux_pwa_generator.generateIndexHtmls(
        index_template_html_file,
        index_html_file,
        manifest_json_file
    );

    if (mode === "prod") {
        await flux_pwa_generator.deleteExcludedFiles(
            libs_folder,
            libs_file_filter
        );

        await flux_pwa_generator.deleteEmptyFolders(
            libs_folder
        );
    }
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
