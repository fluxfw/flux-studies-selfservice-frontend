/** @typedef {import("../../Start/Start.mjs").Start} Start */

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
        return (await import("../Command/HashPasswordCommand.mjs")).HashPasswordCommand.new()
            .hashPassword(
                password,
                start
            );
    }
}
