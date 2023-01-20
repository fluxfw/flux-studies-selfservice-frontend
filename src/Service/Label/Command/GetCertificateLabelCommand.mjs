/** @typedef {import("../../../Adapter/Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetCertificateLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetCertificateLabelCommand}
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
     * @param {Certificate} certificate
     * @returns {Promise<string>}
     */
    async getCertificateLabel(certificate) {
        return await this.#label_service.getLabel(
            certificate.label
        ) ?? certificate.id ?? "";
    }
}
