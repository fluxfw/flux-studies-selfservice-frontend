import { METHOD_POST } from "../../../Libs/flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../../../Libs/flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Post/PostResult.mjs").PostResult} PostResult */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class LogoutCommand {
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
     * @returns {LogoutCommand}
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
    async logout() {
        try {
            await this.#http_api.fetch({
                url: `${__dirname}/../../../api/logout`,
                method: METHOD_POST
            });

            return {
                ok: true
            };
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                "error-messages": [
                    Object.fromEntries(await Promise.all(Object.entries((await this.#localization_api.getLanguages()).all).map(async ([
                        language
                    ]) => [
                            language,
                            await this.#localization_api.translate(
                                error instanceof Response ? "Server error!" : "Network error!",
                                null,
                                null,
                                language
                            )
                        ]
                    )))
                ]
            };
        }
    }
}
