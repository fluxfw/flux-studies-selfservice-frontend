/** @typedef {import("../Country/Country.mjs").Country} Country */
/** @typedef {import("./FilledPersonalData.mjs").FilledPersonalData} FilledPersonalData */
/** @typedef {import("../Language/Language.mjs").Language} Language */
/** @typedef {import("../Place/Place.mjs").Place} Place */
/** @typedef {import("../Salutation/Salutation.mjs").Salutation} Salutation */

/**
 * @typedef {{salutations: Salutation[], "registration-number-format": string, "registration-number-example": string, countries: Country[], "extra-address-line-example": string, "min-house-number": number, "max-house-number": number, "min-postal-code": number, "max-postal-code": number, places: Place[], languages: Language[], "min-birth-date": string, "max-birth-date": string, "old-age-survivar-insurance-number-format": string, "old-age-survivar-insurance-number-example": string, values: FilledPersonalData | null}} PersonalData
 */
