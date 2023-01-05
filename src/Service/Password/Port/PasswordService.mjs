/** @typedef {import("../../../Libs/flux-hash-api/src/Adapter/Api/HashApi.mjs").HashApi} HashApi */

export class PasswordService {
    /**
     * @type {HashApi}
     */
    #hash_api;

    /**
     * @param {HashApi} hash_api
     * @returns {PasswordService}
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
     * @returns {Promise<string>}
     */
    async hashPassword(password) {
        return this.#hash_api.generateHash(
            password,
            "sha-512"
        );
    }
}
