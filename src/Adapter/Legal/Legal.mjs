/** @typedef {import("./AcceptedLegal.mjs").AcceptedLegal} AcceptedLegal */
/** @typedef {import("../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

/**
 * @typedef {{"degree-program": DegreeProgram, subject: Subject, combination: Combination, "single-choice": {[key: string]: string} | null, "multiple-choice": {[key: string]: string[]} | null, "agb-label": {[key: string]: string}, "agb-links": {[key: string]: string}, "max-comments-length": number, values: AcceptedLegal | null}} Legal
 */
