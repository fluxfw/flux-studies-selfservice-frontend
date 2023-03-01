import { CONTENT_TYPE_JSON } from "../../../Libs/flux-http-api/src/Adapter/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../../../Libs/flux-http-api/src/Adapter/Header/HEADER.mjs";
import { HttpClientRequest } from "../../../Libs/flux-http-api/src/Adapter/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../../../Libs/flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class MenuCommand {
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {HttpApi} http_api
     * @returns {MenuCommand}
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
     * @param {string} id
     * @returns {Promise<void>}
     */
    async menu(id) {
        await this.#http_api.request(
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
