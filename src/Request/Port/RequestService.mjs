/** @typedef {import("../../../Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../../Post/Post.mjs").Post} Post */
/** @typedef {import("../../Post/PostResult.mjs").PostResult} PostResult */

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
        await (await import("../Command/BackCommand.mjs")).BackCommand.new(
            this.#flux_http_api
        )
            .back();
    }

    /**
     * @returns {Promise<GetResult>}
     */
    async get() {
        return (await import("../Command/GetCommand.mjs")).GetCommand.new(
            this.#flux_http_api
        )
            .get();
    }

    /**
     * @returns {Promise<Layout>}
     */
    async layout() {
        return (await import("../Command/LayoutCommand.mjs")).LayoutCommand.new(
            this.#flux_http_api
        )
            .layout();
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        await (await import("../Command/LogoutCommand.mjs")).LogoutCommand.new(
            this.#flux_http_api
        )
            .logout();
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async menu(id) {
        await (await import("../Command/MenuCommand.mjs")).MenuCommand.new(
            this.#flux_http_api
        )
            .menu(
                id
            );
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async post(post) {
        return (await import("../Command/PostCommand.mjs")).PostCommand.new(
            this.#flux_http_api
        )
            .post(
                post
            );
    }
}
