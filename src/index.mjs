const flux_studis_selfservice_frontend = (await import("./FluxStudisSelfserviceFrontend.mjs")).FluxStudisSelfserviceFrontend.new();

await flux_studis_selfservice_frontend.init();

await flux_studis_selfservice_frontend.showFrontend();
