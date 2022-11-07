/** @typedef {import("./AcceptedLegal.mjs").AcceptedLegal} AcceptedLegal */
/** @typedef {import("../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../Label/Label.mjs").Label} Label */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

/**
 * @typedef {{"degree-program": DegreeProgram, subject: Subject, combination: Combination, "single-choice": {[key: string]: string} | null, "multiple-choice": {[key: string]: string[]} | null, "agb-label": Label, "agb-links": Label, "max-comments-length": number, values: AcceptedLegal | null}} Legal
 */
