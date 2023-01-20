/** @typedef {import("../../../Adapter/CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetCertificateTypeLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetCertificateTypeLabelCommand}
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
     * @param {CertificateType} certificate_type
     * @returns {Promise<string>}
     */
    async getCertificateTypeLabel(certificate_type) {
        return await this.#label_service.getLabel(
            certificate_type.label
        ) ?? certificate_type.id ?? "";
    }
}
