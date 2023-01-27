import { HttpClientRequest } from "../../../Libs/flux-http-api/src/Adapter/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../Libs/flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class LogoutCommand {
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {HttpApi} http_api
     * @returns {LogoutCommand}
     */
    static new(http_api) {
        return new this(
            http_api
        );
    }

    /**
     * @param {HttpApi} http_api
     * @private
     */
    constructor(http_api) {
        this.#http_api = http_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        await this.#http_api.request(
            HttpClientRequest.new(
                `${__dirname}/../../../api/logout`,
                null,
                METHOD_POST
            )
        );
    }
}
