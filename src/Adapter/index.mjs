import { StudiesSelfserviceFrontendApi } from "./Api/StudiesSelfserviceFrontendApi.mjs";

try {
    const studies_selfservice_frontend_api = StudiesSelfserviceFrontendApi.new();

    await studies_selfservice_frontend_api.init();

    await studies_selfservice_frontend_api.showFrontend();
} catch (error) {
    console.error(error);
}
