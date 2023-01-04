/**
 * @param {string} reg_exp_string
 * @returns {RegExp}
 */
export function regExpStringToRegExp(reg_exp_string) {
    const reg_exp_string_slash_pos = reg_exp_string.lastIndexOf("/");

    return new RegExp(reg_exp_string.substring(1, reg_exp_string_slash_pos), reg_exp_string.substring(reg_exp_string_slash_pos + 1));
}
