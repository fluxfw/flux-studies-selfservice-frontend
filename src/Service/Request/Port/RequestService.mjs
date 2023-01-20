/** @typedef {import("../../../Adapter/Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Post/Post.mjs").Post} Post */
/** @typedef {import("../../../Adapter/Post/PostResult.mjs").PostResult} PostResult */

export class RequestService {
    /**
     * @type {HttpApi}
     */
    #http_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {HttpApi} http_api
     * @param {LocalizationApi} localization_api
     * @returns {RequestService}
     */
    static new(http_api, localization_api) {
        return new this(
            http_api,
            localization_api
        );
    }

    /**
     * @param {HttpApi} http_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(http_api, localization_api) {
        this.#http_api = http_api;
        this.#localization_api = localization_api;
    }

    /**
     * @returns {Promise<PostResult>}
     */
    async back() {
        return (await import("../Command/BackCommand.mjs")).BackCommand.new(
            this.#http_api,
            this.#localization_api
        )
            .back();
    }

    /**
     * @returns {Promise<GetResult | PostResult>}
     */
    async get() {
        return (await import("../Command/GetCommand.mjs")).GetCommand.new(
            this.#http_api,
            this.#localization_api
        )
            .get();
    }

    /**
     * @returns {Promise<PostResult>}
     */
    async logout() {
        return (await import("../Command/LogoutCommand.mjs")).LogoutCommand.new(
            this.#http_api,
            this.#localization_api
        )
            .logout();
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async post(post) {
        return (await import("../Command/PostCommand.mjs")).PostCommand.new(
            this.#http_api,
            this.#localization_api
        )
            .post(
                post
            );
    }
}
