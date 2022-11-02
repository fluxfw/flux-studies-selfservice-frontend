try {
    const studies_selfservice_frontend_api = (await import("./Adapter/Api/StudiesSelfserviceFrontendApi.mjs")).StudiesSelfserviceFrontendApi.new();

    await studies_selfservice_frontend_api.init();

    await studies_selfservice_frontend_api.showFrontend();
} catch (error) {
    console.error(error);
}
