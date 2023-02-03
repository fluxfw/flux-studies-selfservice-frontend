/** @typedef {import("../../../Adapter/IssueYear/IssueYear.mjs").IssueYear} IssueYear */

export class GetIssueYearLabelCommand {
    /**
     * @returns {GetIssueYearLabelCommand}
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
     * @param {IssueYear} issue_year
     * @returns {Promise<string>}
     */
    async getIssueYearLabel(issue_year) {
        return issue_year.id ?? "";
    }
}
