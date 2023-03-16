import { CONTENT_TYPE_JSON } from "../../../Libs/flux-http-api/src/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../../../Libs/flux-http-api/src/Header/HEADER.mjs";
import { HttpClientRequest } from "../../../Libs/flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../Libs/flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../../../Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MenuCommand {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @returns {MenuCommand}
     */
    static new(flux_http_api) {
        return new this(
            flux_http_api
        );
    }

    /**
     * @param {FluxHttpApi} flux_http_api
     * @private
     */
    constructor(flux_http_api) {
        this.#flux_http_api = flux_http_api;
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async menu(id) {
        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`${__dirname}/../../../api/menu`),
                id,
                METHOD_POST,
                {
                    [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                },
                true,
                false
            )
        );
    }
}
