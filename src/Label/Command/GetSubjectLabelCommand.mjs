/** @typedef {import("../../../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Subject/Subject.mjs").Subject} Subject */

export class GetSubjectLabelCommand {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @returns {GetSubjectLabelCommand}
     */
    static new(flux_localization_api, label_service) {
        return new this(
            flux_localization_api,
            label_service
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @private
     */
    constructor(flux_localization_api, label_service) {
        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
    }

    /**
     * @param {Subject} subject
     * @returns {Promise<string>}
     */
    async getSubjectLabel(subject) {
        return this.#flux_localization_api.translate(
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
