/** @typedef {import("../../../Libs/flux-hash-api/src/Adapter/Api/HashApi.mjs").HashApi} HashApi */
/** @typedef {import("../../../Adapter/Start/Start.mjs").Start} Start */

export class HashPasswordCommand {
    /**
     * @type {HashApi}
     */
    #hash_api;

    /**
     * @param {HashApi} hash_api
     * @returns {HashPasswordCommand}
     */
    static new(hash_api) {
        return new this(
            hash_api
        );
    }

    /**
     * @param {HashApi} hash_api
     * @private
     */
    constructor(hash_api) {
        this.#hash_api = hash_api;
    }

    /**
     * @param {string} password
     * @param {Start} start
     * @returns {Promise<string>}
     */
    async hashPassword(password, start) {
        if (!start["hash-password-on-client"]) {
            return password;
        }

        return this.#hash_api.generateHash(
            password,
            start["hash-password-on-client-algorithm"],
            start["hash-password-on-client-radix"]
        );
    }
}
