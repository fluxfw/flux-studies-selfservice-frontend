/** @typedef {import("../../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../Port/LabelService.mjs").LabelService} LabelService */

export class GetDegreeProgramLabelCommand {
    /**
     * @type {LabelService}
     */
    #label_service;

    /**
     * @param {LabelService} label_service
     * @returns {GetDegreeProgramLabelCommand}
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
     * @param {DegreeProgram} degree_program
     * @returns {Promise<string>}
     */
    async getDegreeProgramLabel(degree_program) {
        return await this.#label_service.getLabel(
            degree_program.label
        ) ?? degree_program.id ?? "";
    }
}
