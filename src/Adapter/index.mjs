import { StudiesSelfserviceFrontendApi } from "./Api/StudiesSelfserviceFrontendApi.mjs";

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

try {
    await navigator.serviceWorker.register(`${__dirname}/../service-worker.mjs`, { type: "module" });
} catch (error) {
    console.error(error);
}

try {
    const studies_selfservice_frontend_api = StudiesSelfserviceFrontendApi.new();

    await studies_selfservice_frontend_api.init();

    await studies_selfservice_frontend_api.showFrontend();
} catch (error) {
    console.error(error);
}
