try {
    const studis_selfservice_frontend_api = (await import("./Adapter/Api/StudisSelfserviceFrontendApi.mjs")).StudisSelfserviceFrontendApi.new();

    await studis_selfservice_frontend_api.init();

    await studis_selfservice_frontend_api.showFrontend();
} catch (error) {
    console.error(error);
}
