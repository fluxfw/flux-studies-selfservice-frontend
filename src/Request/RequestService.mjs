import { HttpClientRequest } from "../Libs/flux-http-api/src/Client/HttpClientRequest.mjs";
import { METHOD_POST } from "../Libs/flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/PostResult.mjs").PostResult} PostResult */

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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/back`),
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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/get`),
                null,
                null,
                null,
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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/layout`),
                null,
                null,
                null,
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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/logout`),
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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/menu`),
                id,
                METHOD_POST,
                null,
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
                new URL(`${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/../api/post`),
                post,
                METHOD_POST,
                null,
                true
            )
        )).body.json();
    }
}
