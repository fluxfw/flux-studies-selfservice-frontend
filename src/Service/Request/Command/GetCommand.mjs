import { CONTENT_TYPE_JSON } from "../../../Libs/flux-http-api/src/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../../../Libs/flux-http-api/src/Header/HEADER.mjs";
import { HttpClientRequest } from "../../../Libs/flux-http-api/src/Client/HttpClientRequest.mjs";

/** @typedef {import("../../../Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../../Adapter/Get/GetResult.mjs").GetResult} GetResult */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class GetCommand {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @returns {GetCommand}
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
     * @returns {Promise<GetResult>}
     */
    async get() {
        return (await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`${__dirname}/../../../api/get`),
                null,
                null,
                {
                    [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                },
                true
            )
        )).body.json();
    }
}
