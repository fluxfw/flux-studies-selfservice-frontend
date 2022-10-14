/** @typedef {import("../Canton/Canton.mjs").Canton} Canton */
/** @typedef {import("../Certificate/Certificate.mjs").Certificate} Certificate */
/** @typedef {import("../CertificateType/CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("./ChosenUniversityEntranceQualification.mjs").ChosenUniversityEntranceQualification} ChosenUniversityEntranceQualification */
/** @typedef {import("../Country/Country.mjs").Country} Country */
/** @typedef {import("../Place/Place.mjs").Place} Place */
/** @typedef {import("../School/School.mjs").School} School */

/**
 * @typedef {{"certificate-types": CertificateType[], "min-issue-date": number, "max-issue-date": number, certificates: Certificate[], cantons: Canton[], schools: School[], countries: Country[], places: Place[], values: ChosenUniversityEntranceQualification | null}} UniversityEntranceQualification
 */
