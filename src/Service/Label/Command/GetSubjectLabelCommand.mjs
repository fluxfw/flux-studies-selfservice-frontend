/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Subject/Subject.mjs").Subject} Subject */

export class GetSubjectLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @returns {GetSubjectLabelCommand}
     */
    static new(label_service, localization_api) {
        return new this(
            label_service,
            localization_api
        );
    }

    /**
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(label_service, localization_api) {
        this.#label_service = label_service;
        this.#localization_api = localization_api;
    }

    /**
     * @param {Subject} subject
     * @returns {Promise<string>}
     */
    async getSubjectLabel(subject) {
        return this.#localization_api.translate(
            "{label} ({ect})",
            null,
            {
                ect: await this.#label_service.getEctLabel(
                    subject.ect
                ),
                label: await this.#label_service.getLabel(
                    subject.label
                ) ?? subject.id ?? ""
            }
        );
    }
}
