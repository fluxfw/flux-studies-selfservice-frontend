/** @typedef {import("../../../Adapter/Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../Adapter/Post/Post.mjs").Post} Post */
/** @typedef {import("../../../Adapter/Post/PostResult.mjs").PostResult} PostResult */

export class RequestService {
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {HttpApi} http_api
     * @returns {RequestService}
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
    async back() {
        await (await import("../Command/BackCommand.mjs")).BackCommand.new(
            this.#http_api
        )
            .back();
    }

    /**
     * @returns {Promise<GetResult>}
     */
    async get() {
        return (await import("../Command/GetCommand.mjs")).GetCommand.new(
            this.#http_api
        )
            .get();
    }

    /**
     * @returns {Promise<void>}
     */
    async logout() {
        await (await import("../Command/LogoutCommand.mjs")).LogoutCommand.new(
            this.#http_api
        )
            .logout();
    }

    /**
     * @param {string} id
     * @returns {Promise<void>}
     */
    async menu(id) {
        await (await import("../Command/MenuCommand.mjs")).MenuCommand.new(
            this.#http_api
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
            this.#http_api
        )
            .post(
                post
            );
    }
}
