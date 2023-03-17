/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Language/Language.mjs").Language} Language */

export class GetLanguageLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetLanguageLabelCommand}
     */
    static new(label_service) {
        return new this(
            label_service
        );
    }

    /**
     * @param {LabelService} label_service
     * @private
     */
    constructor(label_service) {
        this.#label_service = label_service;
    }

    /**
     * @param {Language} language
     * @returns {Promise<string>}
     */
    async getLanguageLabel(language) {
        return await this.#label_service.getLabel(
            language.label
        ) ?? language.id ?? "";
    }
}
