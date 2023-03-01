import { CONTENT_TYPE_JSON } from "../../../Libs/flux-http-api/src/Adapter/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../../../Libs/flux-http-api/src/Adapter/Header/HEADER.mjs";
import { HttpClientRequest } from "../../../Libs/flux-http-api/src/Adapter/Client/HttpClientRequest.mjs";

/** @typedef {import("../../../Adapter/Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class GetCommand {
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {HttpApi} http_api
     * @returns {GetCommand}
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
     * @returns {Promise<GetResult>}
     */
    async get() {
        return (await this.#http_api.request(
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
