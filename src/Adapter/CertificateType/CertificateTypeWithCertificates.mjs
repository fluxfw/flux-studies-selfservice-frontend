/** @typedef {import("./CertificateType.mjs").CertificateType} CertificateType */
/** @typedef {import("../Certificate/CertificateWithCantons.mjs").CertificateWithCantons} CertificateWithCantons */

/**
 * @typedef {CertificateType & {"min-issue-date": number, "max-issue-date": number, certificates: CertificateWithCantons[]}} CertificateTypeWithCertificates
 */
