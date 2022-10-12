/** @typedef {import("./AcceptedLegal.mjs").AcceptedLegal} AcceptedLegal */
/** @typedef {import("../Combination/Combination.mjs").Combination} Combination */
/** @typedef {import("../Subject/Subject.mjs").Subject} Subject */

/**
 * @typedef {{subject: Subject, combination: Combination, "single-choice": {[key: string]: string} | null, "multiple-choice": {[key: string]: string[]} | null, "agb": string, "max-comments-length": number, values: AcceptedLegal | null}} Legal
 */
