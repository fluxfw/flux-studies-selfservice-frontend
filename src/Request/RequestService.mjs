import { CONTENT_TYPE_JSON } from "../Libs/flux-http-api/src/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../Libs/flux-http-api/src/Header/HEADER.mjs";
import { HttpClientRequest } from "../Libs/flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../Libs/flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/PostResult.mjs").PostResult} PostResult */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class RequestService {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @returns {RequestService}
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
     * @returns {Promise<void>}
     */
    async back() {
        await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`${__dirname}/../api/back`),
                null,
                METHOD_POST,
                null,
                true,
                false
            )
        );
    }

    /**
     * @returns {Promise<GetResult>}
     */
    async get() {
        return (await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`${__dirname}/../api/get`),
                null,
                null,
                {
                    [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                },
                true
            )
        )).body.json();
    }

    /**
     * @returns {Promise<Layout>}
     */
    async layout() {
        return (await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`${__dirname}/../api/layout`),
                null,
                null,
                {
                    [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                },
                true
            )
        )).body.json();
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        await this.#flux_http_api.request(
            HttpClientRequest.new(
                new URL(`${__dirname}/../api/logout`),
                null,
                METHOD_POST,
                null,
                true,
                false
            )
        );
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async menu(id) {
        await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`${__dirname}/../api/menu`),
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

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async post(post) {
        return (await this.#flux_http_api.request(
            HttpClientRequest.json(
                new URL(`${__dirname}/../api/post`),
                post,
                METHOD_POST,
                {
                    [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                },
                true
            )
        )).body.json();
    }
}
