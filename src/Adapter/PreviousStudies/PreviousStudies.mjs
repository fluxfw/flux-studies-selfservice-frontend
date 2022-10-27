/** @typedef {import("../Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("./ChosenPreviousStudies.mjs").ChosenPreviousStudies} ChosenPreviousStudies */
/** @typedef {import("../Country/Country.mjs").Country} Country */
/** @typedef {import("../Degree/Degree.mjs").Degree} Degree */
/** @typedef {import("../Place/Place.mjs").Place} Place */
/** @typedef {import("../School/School.mjs").School} School */

/**
 * @typedef {{"certificate-types": CertificateType[], "min-start-date": number, "max-start-date": number, "min-end-date": number, "max-end-date": number, schools: School[], "min-semesters": number, "max-semesters": number, degrees: Degree[], countries: Country[], cantons: Canton[], places: Place[], values: ChosenPreviousStudies | null}} PreviousStudies
 */
