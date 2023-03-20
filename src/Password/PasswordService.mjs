/** @typedef {import("../Start/Start.mjs").Start} Start */

export class PasswordService {
    /**
     * @returns {PasswordService}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

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

        return Array.from(new Uint8Array(await crypto.subtle.digest(start["hash-password-on-client-algorithm"] ?? "SHA-256", new TextEncoder().encode(password)))).map(x => x.toString(start["hash-password-on-client-radix"] ?? 16)[start["hash-password-on-client-padding-end"] ?? false ? "padEnd" : "padStart"](start["hash-password-on-client-padding-length"] ?? 2, start["hash-password-on-client-padding-character"] ?? "0")).join("");
    }
}
