/** @typedef {import("../AreaCode/AreaCode.mjs").AreaCode} AreaCode */
/** @typedef {import("../CorrespondenceLanguage/CorrespondenceLanguage.mjs").CorrespondenceLanguage} CorrespondenceLanguage */
/** @typedef {import("../Country/Country.mjs").Country} Country */
/** @typedef {import("./FilledPersonalData.mjs").FilledPersonalData} FilledPersonalData */
/** @typedef {import("../MotherLanguage/MotherLanguage.mjs").MotherLanguage} MotherLanguage */
/** @typedef {import("../Nationally/Nationally.mjs").Nationally} Nationally */
/** @typedef {import("../OriginPlace/OriginPlace.mjs").OriginPlace} OriginPlace */
/** @typedef {import("../Place/PlaceWithPostalCode.mjs").PlaceWithPostalCode} PlaceWithPostalCode */
/** @typedef {import("../Salutation/Salutation.mjs").Salutation} Salutation */

/**
 * @typedef {{salutations: Salutation[], "registration-number-format": string, "registration-number-example": string, countries: Country[], "extra-address-line-example": string, "min-house-number": number, "max-house-number": number, "min-postal-code": number, "max-postal-code": number, places: PlaceWithPostalCode[], "area-codes": AreaCode[], "required-phone": boolean, "only-one-phone": boolean, "required-phone-home": boolean, "required-phone-mobile": boolean, "required-phone-business": boolean, "required-email": boolean, "mother-languages": MotherLanguage[], "correspondence-languages": CorrespondenceLanguage[], "min-birth-date": string, "max-birth-date": string, "old-age-survivar-insurance-number-format": string, "old-age-survivar-insurance-number-example": string, nationalities: Nationally[], "origin-places": OriginPlace[], values: FilledPersonalData | null}} PersonalData
 */
