#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { basename, dirname, extname, join } from "node:path/posix";

let flux_shutdown_handler = null;
try {
    flux_shutdown_handler = (await import("../../flux-shutdown-handler/src/FluxShutdownHandler.mjs")).FluxShutdownHandler.new();

    const prod = process.argv[2] ?? null;
    if (prod === null) {
        throw new Error("Please pass prod or dev");
    }

    const flux_pwa_generator = (await import("../../flux-pwa-generator/src/FluxPwaGenerator.mjs")).FluxPwaGenerator.new(
        (await import("../../flux-localization-api/src/FluxLocalizationApi.mjs")).FluxLocalizationApi.new()
    );

    const bin_folder = dirname(fileURLToPath(import.meta.url));
    const root_folder = join(bin_folder, "..");
    const libs_folder = join(root_folder, "..");
    const src_folder = join(root_folder, "src");
    const icon_folder = join(src_folder, "Icon");
    const localization_folder = join(src_folder, "Localization");
    const manifest_folder = join(src_folder, "Manifest");
    const index_template_html_file = join(src_folder, "index-template.html");
    const index_html_file = join(src_folder, "index.html");
    const icon_template_file = join(icon_folder, "icon-template.svg");
    const manifest_template_json_file = join(manifest_folder, "manifest-template.json");
    const manifest_json_file = join(manifest_folder, "manifest.json");
    const libs_file_filter = file => file.startsWith("flux-") ? (file.includes("/bin/") || file.includes("/src/")) && !file.startsWith("flux-pwa-generator/") && !file.endsWith("/bin/build.mjs") && ![
        ".md",
        ".sh"
    ].includes(extname(file)) && !basename(file).includes("-template") : true;

    await flux_pwa_generator.generateManifestJsons(
        manifest_template_json_file,
        manifest_json_file,
        localization_folder
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

    if (prod === "prod") {
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
