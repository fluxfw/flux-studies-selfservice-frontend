import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PERSONAL_DATA } from "../Page/PAGE.mjs";
import { PHONE_TYPES } from "./PHONE_TYPES.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { valueToRegExp } from "../Libs/flux-form/src/DEFAULT_ADDITIONAL_VALIDATION_TYPES.mjs";
import { LOCALIZATION_KEY_ADDITIONAL_FIRST_NAMES_ONE_PER_LINE, LOCALIZATION_KEY_ADDRESS, LOCALIZATION_KEY_APPARTEMENT_HOUSE_NUMBER, LOCALIZATION_KEY_BIRTH_DATE, LOCALIZATION_KEY_CONTACT, LOCALIZATION_KEY_CORRESPONDENCE_LANGUAGE, LOCALIZATION_KEY_COUNTRY, LOCALIZATION_KEY_E_MAIL, LOCALIZATION_KEY_ENTER_PARENTS_ADDRESS, LOCALIZATION_KEY_EXTRA_ADDRESS_LINE_E_G_EXAMPLE, LOCALIZATION_KEY_FIRST_NAME, LOCALIZATION_KEY_FIRST_NAMES_ONE_PER_LINE, LOCALIZATION_KEY_FORMAT_EXAMPLE, LOCALIZATION_KEY_GENERAL_POST_TO_PARENTS, LOCALIZATION_KEY_INVOICES_TO_PARENTS, LOCALIZATION_KEY_LAST_NAME, LOCALIZATION_KEY_MOTHER_LANGUAGE, LOCALIZATION_KEY_NATIONALLY, LOCALIZATION_KEY_ORIGIN_PLACE, LOCALIZATION_KEY_PARENTS_ADDRESS, LOCALIZATION_KEY_PERSONAL_DATA, LOCALIZATION_KEY_PERSONAL_INFORMATION, LOCALIZATION_KEY_PHONE_BUSINESS, LOCALIZATION_KEY_PHONE_HOME, LOCALIZATION_KEY_PHONE_MOBILE, LOCALIZATION_KEY_PHONE_TITLE_PHONE_NUMBER_FORMAT, LOCALIZATION_KEY_PLACE, LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA, LOCALIZATION_KEY_PLEASE_EITHER_ENTER_BOTH_AREA_CODE_NUMBER_OR_NEITHER_OF_THEM, LOCALIZATION_KEY_PLEASE_ENTER_A_PHONE, LOCALIZATION_KEY_PLEASE_ENTER_AT_LEAST_ONE_PHONE, LOCALIZATION_KEY_PLEASE_ENTER_ONLY_ONE_PHONE, LOCALIZATION_KEY_PLEASE_PAY_ATTENTION_TO_USE_THE_CORRECT_SPELLING_UPPER_AND_LOWER_CASE_LETTERS, LOCALIZATION_KEY_POSTAL_ADDRESS, LOCALIZATION_KEY_POSTAL_CODE, LOCALIZATION_KEY_POSTAL_CODE_AND_PLACE_DOES_NOT_MATCH, LOCALIZATION_KEY_POSTAL_OFFICE_BOX, LOCALIZATION_KEY_REGISTRATION_NUMBER_FORMAT_EXAMPLE, LOCALIZATION_KEY_SALUTATION, LOCALIZATION_KEY_SECOND_FIRST_NAME, LOCALIZATION_KEY_SOME_LINE_CONTAINS_NO_NAME, LOCALIZATION_KEY_STREET, LOCALIZATION_KEY_SWISS_OLD_AGE_AND_SURVIVAR_INSURANCE_NUMBER_AHV_OASI_FORMAT_EXAMPLE, LOCALIZATION_KEY_YOUR_PARENTS_HAVE_THE_SAME_ADDRESS_AS_YOU } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./filledPersonalDataFunction.mjs").filledPersonalDataFunction} filledPersonalDataFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./PersonalData.mjs").PersonalData} PersonalData */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PersonalDataElement.css`
);

export class PersonalDataElement extends HTMLElement {
    /**
     * @type {FormElement}
     */
    #address_form_element;
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {FormElement}
     */
    #contact_form_element;
    /**
     * @type {filledPersonalDataFunction}
     */
    #filled_personal_data_function;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {FormElement}
     */
    #origin_place_form_element;
    /**
     * @type {FormElement}
     */
    #parents_address_form_element;
    /**
     * @type {FormElement | null}
     */
    #postal_address_form_element = null;
    /**
     * @type {PersonalData}
     */
    #personal_data;
    /**
     * @type {FormElement}
     */
    #personal_information_form_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PersonalData} personal_data
     * @param {filledPersonalDataFunction} filled_personal_data_function
     * @param {backFunction | null} back_function
     * @returns {PersonalDataElement}
     */
    static new(flux_localization_api, label_service, personal_data, filled_personal_data_function, back_function = null) {
        return new this(
            flux_localization_api,
            label_service,
            personal_data,
            filled_personal_data_function,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PersonalData} personal_data
     * @param {filledPersonalDataFunction} filled_personal_data_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, label_service, personal_data, filled_personal_data_function, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#personal_data = personal_data;
        this.#filled_personal_data_function = filled_personal_data_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        this.#shadow.adoptedStyleSheets.push(css);

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #filledPersonalData() {
        if (!await this.#address_form_element.validate() || !await this.#contact_form_element.validate() || !await this.#personal_information_form_element.validate() || !await this.#origin_place_form_element.validate() || !await this.#parents_address_form_element.validate() || !(this.#postal_address_form_element !== null ? await this.#postal_address_form_element.validate() : true)) {
            return;
        }

        const post_result = await this.#filled_personal_data_function(
            {
                salutation: this.#address_form_element.inputs.salutation.value,
                "first-name": this.#address_form_element.inputs["first-name"].value,
                "second-first-name": this.#address_form_element.inputs["second-first-name"].value,
                "additional-first-names": this.#address_form_element.inputs["additional-first-names"].value.split("\n").filter(name => name !== ""),
                "last-name": this.#address_form_element.inputs["last-name"].value,
                "registration-number": this.#address_form_element.inputs["registration-number"].value,
                country: this.#address_form_element.inputs.country.value,
                "extra-address-line": this.#address_form_element.inputs["extra-address-line"].value,
                street: this.#address_form_element.inputs.street.value,
                "house-number": this.#address_form_element.inputs["house-number"].valueAsNumber,
                "postal-office-box": this.#address_form_element.inputs["postal-office-box"].value,
                "postal-code": this.#address_form_element.inputs["postal-code"].valueAsNumber,
                place: this.#address_form_element.inputs.place.value,
                ...PHONE_TYPES.reduce((phones, phone_type) => ({
                    ...phones,
                    [`${phone_type}-phone-area-code`]: this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value,
                    [`${phone_type}-phone-number`]: this.#contact_form_element.inputs[`${phone_type}-phone-number`].value
                }), {}),
                email: this.#contact_form_element.inputs.email.value,
                "mother-language": this.#contact_form_element.inputs["mother-language"].value,
                "correspondence-language": this.#contact_form_element.inputs["correspondence-language"].value,
                "birth-date": this.#personal_information_form_element.inputs["birth-date"].value,
                "old-age-survivar-insurance-number": this.#personal_information_form_element.inputs["old-age-survivar-insurance-number"].value,
                nationally: this.#personal_information_form_element.inputs.nationally.value,
                "origin-place": this.#origin_place_form_element.inputs["origin-place"].value,
                "parents-address": this.#parents_address_form_element.inputs["parents-address"].checked,
                ...this.#parents_address_form_element.inputs["parents-address"].checked ? {
                    "parents-address-salutation": this.#parents_address_form_element.inputs["parents-address-salutation"].value,
                    "parents-address-first-names": this.#parents_address_form_element.inputs["parents-address-first-names"].value.split("\n").filter(name => name !== ""),
                    "parents-address-last-name": this.#parents_address_form_element.inputs["parents-address-last-name"].value,
                    "parents-address-same-address": this.#parents_address_form_element.inputs["parents-address-same-address"].checked,
                    ...!this.#parents_address_form_element.inputs["parents-address-same-address"].checked ? {
                        "parents-address-country": this.#parents_address_form_element.inputs["parents-address-country"].value,
                        "parents-address-extra-address-line": this.#parents_address_form_element.inputs["parents-address-extra-address-line"].value,
                        "parents-address-street": this.#parents_address_form_element.inputs["parents-address-street"].value,
                        "parents-address-house-number": this.#parents_address_form_element.inputs["parents-address-house-number"].valueAsNumber,
                        "parents-address-postal-code": this.#parents_address_form_element.inputs["parents-address-postal-code"].valueAsNumber,
                        "parents-address-place": this.#parents_address_form_element.inputs["parents-address-place"].value
                    } : {
                        "parents-address-country": null,
                        "parents-address-extra-address-line": null,
                        "parents-address-street": null,
                        "parents-address-house-number": null,
                        "parents-address-postal-code": null,
                        "parents-address-place": null
                    },
                    "parents-address-general-post": this.#postal_address_form_element.inputs["parents-address-general-post"].checked,
                    "parents-address-invoices": this.#postal_address_form_element.inputs["parents-address-invoices"].checked
                } : {
                    "parents-address-salutation": null,
                    "parents-address-first-names": null,
                    "parents-address-last-name": null,
                    "parents-address-same-address": null,
                    "parents-address-country": null,
                    "parents-address-extra-address-line": null,
                    "parents-address-street": null,
                    "parents-address-house-number": null,
                    "parents-address-postal-code": null,
                    "parents-address-place": null,
                    "parents-address-general-post": null,
                    "parents-address-invoices": null
                }
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                (this.#postal_address_form_element !== null ? this.#postal_address_form_element : this.#parents_address_form_element).addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                );
            }
        } else {
            (this.#postal_address_form_element !== null ? this.#postal_address_form_element : this.#parents_address_form_element).addInvalidMessage(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA
                )
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.append(TitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PERSONAL_DATA
            )
        ));

        this.#shadow.append(SubtitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PLEASE_PAY_ATTENTION_TO_USE_THE_CORRECT_SPELLING_UPPER_AND_LOWER_CASE_LETTERS
            )
        ));

        this.#address_form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                const additional_first_names = this.#address_form_element.inputs["additional-first-names"].value;
                if (additional_first_names !== "" && additional_first_names.split("\n").some(name => name === "")) {
                    this.#address_form_element.setCustomValidationMessage(
                        this.#address_form_element.inputs["additional-first-names"],
                        await this.#flux_localization_api.translate(
                            LOCALIZATION_MODULE,
                            LOCALIZATION_KEY_SOME_LINE_CONTAINS_NO_NAME
                        )
                    );
                    return false;
                }

                if (this.#address_form_element.inputs["postal-code"].valueAsNumber !== this.#personal_data.places.find(place => place.id === this.#address_form_element.inputs.place.value)["postal-code"]) {
                    this.#address_form_element.setCustomValidationMessage(
                        this.#address_form_element.inputs["postal-code"],
                        await this.#flux_localization_api.translate(
                            LOCALIZATION_MODULE,
                            LOCALIZATION_KEY_POSTAL_CODE_AND_PLACE_DOES_NOT_MATCH
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#address_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_ADDRESS
            )
        );

        const salutation_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SALUTATION
            ),
            "select",
            "salutation"
        );
        salutation_element.required = true;

        for (const salutation of this.#personal_data.salutations) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getSalutationLabel(
                salutation
            );
            option_element.value = salutation.id;
            salutation_element.append(option_element);
        }

        const first_name_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_FIRST_NAME
            ),
            "text",
            "first-name"
        );
        first_name_element.required = true;

        const second_first_name_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SECOND_FIRST_NAME
            ),
            "text",
            "second-first-name"
        );

        const additional_first_names_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_ADDITIONAL_FIRST_NAMES_ONE_PER_LINE
            ),
            "textarea",
            "additional-first-names"
        );

        const last_name_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_LAST_NAME
            ),
            "text",
            "last-name"
        );
        last_name_element.required = true;

        const registration_number_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_REGISTRATION_NUMBER_FORMAT_EXAMPLE,
                {
                    example: this.#personal_data["registration-number-example"]
                }
            ),
            "text",
            "registration-number"
        );
        registration_number_element.pattern = (await valueToRegExp(
            this.#personal_data["registration-number-format"],
            true
        )).source;

        const country_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_COUNTRY
            ),
            "select",
            "country"
        );
        country_element.required = true;

        for (const country of this.#personal_data.countries) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            country_element.append(option_element);
        }

        const extra_address_line_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_EXTRA_ADDRESS_LINE_E_G_EXAMPLE,
                {
                    example: this.#personal_data["extra-address-line-example"]
                }
            ),
            "text",
            "extra-address-line"
        );

        const street_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_STREET
            ),
            "text",
            "street"
        );
        street_element.required = true;

        const house_number_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_APPARTEMENT_HOUSE_NUMBER
            ),
            "number",
            "house-number"
        );
        house_number_element.inputMode = "numeric";
        house_number_element.max = this.#personal_data["max-house-number"];
        house_number_element.min = this.#personal_data["min-house-number"];
        house_number_element.required = true;
        house_number_element.step = 1;

        const postal_office_box_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_POSTAL_OFFICE_BOX
            ),
            "text",
            "postal-office-box"
        );

        const postal_code_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_POSTAL_CODE
            ),
            "number",
            "postal-code"
        );
        postal_code_element.inputMode = "numeric";
        postal_code_element.max = this.#personal_data["max-postal-code"];
        postal_code_element.min = this.#personal_data["min-postal-code"];
        postal_code_element.required = true;
        postal_code_element.step = 1;

        const place_element = this.#address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PLACE
            ),
            "select",
            "place"
        );
        place_element.required = true;

        for (const place of this.#personal_data.places) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            place_element.append(option_element);
        }

        postal_code_element.addEventListener("input", () => {
            if (postal_code_element.value === "" || place_element.value !== "") {
                return;
            }

            const place = this.#personal_data.places.find(_place => _place["postal-code"] === postal_code_element.valueAsNumber) ?? null;
            if (place === null) {
                return;
            }

            place_element.value = place.id;
        });
        place_element.addEventListener("input", () => {
            if (place_element.value === "" || postal_code_element.value !== "") {
                return;
            }

            const place = this.#personal_data.places.find(_place => _place.id === place_element.value) ?? null;
            if (place === null) {
                return;
            }

            postal_code_element.valueAsNumber = place["postal-code"];
        });

        this.#shadow.append(this.#address_form_element);

        this.#contact_form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                for (const phone_type of PHONE_TYPES) {
                    if (this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value === "" && this.#contact_form_element.inputs[`${phone_type}-phone-number`].value !== "") {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${phone_type}-phone-area-code`],
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_PLEASE_EITHER_ENTER_BOTH_AREA_CODE_NUMBER_OR_NEITHER_OF_THEM
                            )
                        );
                        return false;
                    }

                    if (this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value !== "" && this.#contact_form_element.inputs[`${phone_type}-phone-number`].value === "") {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${phone_type}-phone-number`],
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_PLEASE_EITHER_ENTER_BOTH_AREA_CODE_NUMBER_OR_NEITHER_OF_THEM
                            )
                        );
                        return false;
                    }
                }

                if (this.#personal_data["required-phone"]) {
                    if (!PHONE_TYPES.some(phone_type => this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value !== "")) {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${PHONE_TYPES[0]}-phone-area-code`],
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                this.#personal_data["only-one-phone"] ? LOCALIZATION_KEY_PLEASE_ENTER_A_PHONE : LOCALIZATION_KEY_PLEASE_ENTER_AT_LEAST_ONE_PHONE
                            )
                        );
                        return false;
                    }
                }

                if (this.#personal_data["only-one-phone"]) {
                    if (PHONE_TYPES.filter(phone_type => this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value !== "").length > 1) {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${PHONE_TYPES[0]}-phone-area-code`],
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_PLEASE_ENTER_ONLY_ONE_PHONE
                            )
                        );
                        return false;
                    }
                }

                return true;
            }
        );

        this.#contact_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_CONTACT
            )
        );

        for (const phone_type of PHONE_TYPES) {
            const area_code_element = this.#contact_form_element.addInput(
                "",
                "select",
                `${phone_type}-phone-area-code`,
                false,
                true
            );
            area_code_element.dataset.small = true;
            area_code_element.required = this.#personal_data[`required-phone-${phone_type}`];

            for (const area_code of this.#personal_data["area-codes"]) {
                const option_element = document.createElement("option");
                option_element.text = await this.#label_service.getAreaCodeLabel(
                    area_code
                );
                option_element.value = area_code.id;
                area_code_element.append(option_element);
            }

            const number_element = this.#contact_form_element.addInput(
                "",
                "tel",
                `${phone_type}-phone-number`
            );
            number_element.inputMode = "tel";
            number_element.required = this.#personal_data[`required-phone-${phone_type}`];

            number_element.parentElement.remove();
            area_code_element.after(number_element);

            area_code_element.addEventListener("input", async () => {
                this.#renderPhoneNumberFormat(
                    phone_type
                );
            });
        }

        const email_element = this.#contact_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_E_MAIL
            ),
            "email",
            "email"
        );
        email_element.inputMode = "email";
        email_element.required = this.#personal_data["required-email"];

        const mother_language_element = this.#contact_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_MOTHER_LANGUAGE
            ),
            "select",
            "mother-language"
        );
        mother_language_element.required = true;

        for (const mother_language of this.#personal_data["mother-languages"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getMotherLanguageLabel(
                mother_language
            );
            option_element.value = mother_language.id;
            mother_language_element.append(option_element);
        }

        const correspondence_language_element = this.#contact_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_CORRESPONDENCE_LANGUAGE
            ),
            "select",
            "correspondence-language"
        );
        correspondence_language_element.required = true;

        for (const correspondence_language of this.#personal_data["correspondence-languages"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCorrespondenceLanguageLabel(
                correspondence_language
            );
            option_element.value = correspondence_language.id;
            correspondence_language_element.append(option_element);
        }

        this.#shadow.append(this.#contact_form_element);

        this.#personal_information_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#personal_information_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PERSONAL_INFORMATION
            )
        );

        const birth_date_element = this.#personal_information_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_BIRTH_DATE
            ),
            "date",
            "birth-date"
        );
        birth_date_element.max = this.#personal_data["max-birth-date"];
        birth_date_element.min = this.#personal_data["min-birth-date"];
        birth_date_element.required = true;

        const old_age_survivar_insurance_number_element = this.#personal_information_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SWISS_OLD_AGE_AND_SURVIVAR_INSURANCE_NUMBER_AHV_OASI_FORMAT_EXAMPLE,
                {
                    ahv: "AHV",
                    oasi: "OASI",
                    example: this.#personal_data["old-age-survivar-insurance-number-example"]
                }
            ),
            "text",
            "old-age-survivar-insurance-number"
        );
        old_age_survivar_insurance_number_element.pattern = (await valueToRegExp(
            this.#personal_data["old-age-survivar-insurance-number-format"],
            true
        )).source;

        const nationally_element = this.#personal_information_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_NATIONALLY
            ),
            "select",
            "nationally"
        );
        nationally_element.required = true;

        for (const nationally of this.#personal_data.nationalities) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getNationallyLabel(
                nationally
            );
            option_element.value = nationally.id;
            nationally_element.append(option_element);
        }

        this.#shadow.append(this.#personal_information_form_element);

        this.#origin_place_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#origin_place_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_ORIGIN_PLACE
            )
        );

        const origin_place_element = this.#origin_place_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_ORIGIN_PLACE
            ),
            "select",
            "origin-place"
        );
        origin_place_element.required = true;

        for (const origin_place of this.#personal_data["origin-places"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getOriginPlaceLabel(
                origin_place
            );
            option_element.value = origin_place.id;
            origin_place_element.append(option_element);
        }

        this.#shadow.append(this.#origin_place_form_element);

        this.#parents_address_form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                if (this.#parents_address_form_element.inputs["parents-address"].checked) {
                    const parents_address_first_names = this.#parents_address_form_element.inputs["parents-address-first-names"].value;
                    if (parents_address_first_names !== "" && parents_address_first_names.split("\n").some(name => name === "")) {
                        this.#parents_address_form_element.setCustomValidationMessage(
                            this.#parents_address_form_element.inputs["parents-address-first-names"],
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_SOME_LINE_CONTAINS_NO_NAME
                            )
                        );
                        return false;
                    }

                    if (!this.#parents_address_form_element.inputs["parents-address-same-address"].checked) {
                        if (this.#parents_address_form_element.inputs["parents-address-postal-code"].valueAsNumber !== this.#personal_data.places.find(place => place.id === this.#parents_address_form_element.inputs["parents-address-place"].value)["postal-code"]) {
                            this.#parents_address_form_element.setCustomValidationMessage(
                                this.#parents_address_form_element.inputs["parents-address-postal-code"],
                                await this.#flux_localization_api.translate(
                                    LOCALIZATION_MODULE,
                                    LOCALIZATION_KEY_POSTAL_CODE_AND_PLACE_DOES_NOT_MATCH
                                )
                            );
                            return false;
                        }
                    }
                }

                return true;
            }
        );

        this.#parents_address_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PARENTS_ADDRESS
            )
        );

        const parents_address_element = this.#parents_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_ENTER_PARENTS_ADDRESS
            ),
            "checkbox",
            "parents-address"
        );
        parents_address_element.addEventListener("input", () => {
            this.#renderParentsAddress();
        });

        await this.#parents_address_form_element.addButtons(
            () => {
                this.#filledPersonalData();
            },
            this.#back_function
        );

        this.#shadow.append(this.#parents_address_form_element);

        this.#shadow.append(MandatoryElement.new(
            this.#flux_localization_api
        ));

        if (this.#personal_data.values !== null) {
            salutation_element.value = this.#personal_data.values.salutation;

            first_name_element.value = this.#personal_data.values["first-name"];

            second_first_name_element.value = this.#personal_data.values["second-first-name"];

            additional_first_names_element.value = this.#personal_data.values["additional-first-names"].join("\n");

            last_name_element.value = this.#personal_data.values["last-name"];

            registration_number_element.value = this.#personal_data.values["registration-number"];

            country_element.value = this.#personal_data.values.country;

            extra_address_line_element.value = this.#personal_data.values["extra-address-line"];

            street_element.value = this.#personal_data.values.street;

            house_number_element.valueAsNumber = this.#personal_data.values["house-number"];

            postal_office_box_element.value = this.#personal_data.values["postal-office-box"];

            postal_code_element.valueAsNumber = this.#personal_data.values["postal-code"];

            place_element.value = this.#personal_data.values.place;

            for (const phone_type of PHONE_TYPES) {
                this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value = this.#personal_data.values[`${phone_type}-phone-area-code`];

                await this.#renderPhoneNumberFormat(
                    phone_type
                );

                this.#contact_form_element.inputs[`${phone_type}-phone-number`].value = this.#personal_data.values[`${phone_type}-phone-number`];
            }

            email_element.value = this.#personal_data.values.email;

            mother_language_element.value = this.#personal_data.values["mother-language"];

            correspondence_language_element.value = this.#personal_data.values["correspondence-language"];

            birth_date_element.value = this.#personal_data.values["birth-date"];

            old_age_survivar_insurance_number_element.value = this.#personal_data.values["old-age-survivar-insurance-number"];

            nationally_element.value = this.#personal_data.values.nationally;

            origin_place_element.value = this.#personal_data.values["origin-place"];

            parents_address_element.checked = this.#personal_data.values["parents-address"];

            await this.#renderParentsAddress();

            if (this.#personal_data.values["parents-address"]) {
                this.#parents_address_form_element.inputs["parents-address-salutation"].value = this.#personal_data.values["parents-address-salutation"];

                this.#parents_address_form_element.inputs["parents-address-first-names"].value = this.#personal_data.values["parents-address-first-names"].join("\n");

                this.#parents_address_form_element.inputs["parents-address-last-name"].value = this.#personal_data.values["parents-address-last-name"];

                this.#parents_address_form_element.inputs["parents-address-same-address"].checked = this.#personal_data.values["parents-address-same-address"];

                await this.#renderParentsAddress2();

                if (!this.#personal_data.values["parents-address-same-address"]) {
                    this.#parents_address_form_element.inputs["parents-address-country"].value = this.#personal_data.values["parents-address-country"];

                    this.#parents_address_form_element.inputs["parents-address-extra-address-line"].value = this.#personal_data.values["parents-address-extra-address-line"];

                    this.#parents_address_form_element.inputs["parents-address-street"].value = this.#personal_data.values["parents-address-street"];

                    this.#parents_address_form_element.inputs["parents-address-house-number"].valueAsNumber = this.#personal_data.values["parents-address-house-number"];

                    this.#parents_address_form_element.inputs["parents-address-postal-code"].valueAsNumber = this.#personal_data.values["parents-address-postal-code"];

                    this.#parents_address_form_element.inputs["parents-address-place"].value = this.#personal_data.values["parents-address-place"];
                }

                this.#postal_address_form_element.inputs["parents-address-general-post"].checked = this.#personal_data.values["parents-address-general-post"];

                this.#postal_address_form_element.inputs["parents-address-invoices"].checked = this.#personal_data.values["parents-address-invoices"];
            }
        } else {
            for (const phone_type of PHONE_TYPES) {
                await this.#renderPhoneNumberFormat(
                    phone_type
                );
            }
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderParentsAddress() {
        this.#parents_address_form_element.inputs["parents-address-salutation"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-first-names"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-last-name"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-same-address"]?.parentElement?.remove();

        if (this.#postal_address_form_element !== null) {
            this.#postal_address_form_element.remove();
            this.#postal_address_form_element = null;
        }

        await this.#parents_address_form_element.addButtons(
            () => {
                this.#filledPersonalData();
            },
            this.#back_function
        );

        if (!this.#parents_address_form_element.inputs["parents-address"].checked) {
            await this.#renderParentsAddress2();
            return;
        }

        this.#parents_address_form_element.removeButtons();

        const parents_address_salutation_element = this.#parents_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_SALUTATION
            ),
            "select",
            "parents-address-salutation"
        );
        parents_address_salutation_element.required = true;

        for (const salutation of this.#personal_data.salutations) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getSalutationLabel(
                salutation
            );
            option_element.value = salutation.id;
            parents_address_salutation_element.append(option_element);
        }

        const parents_address_first_names_element = this.#parents_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_FIRST_NAMES_ONE_PER_LINE
            ),
            "textarea",
            "parents-address-first-names"
        );
        parents_address_first_names_element.required = true;

        const parents_address_last_name_element = this.#parents_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_LAST_NAME
            ),
            "text",
            "parents-address-last-name"
        );
        parents_address_last_name_element.required = true;

        const parents_address_same_address_element = this.#parents_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_YOUR_PARENTS_HAVE_THE_SAME_ADDRESS_AS_YOU
            ),
            "checkbox",
            "parents-address-same-address"
        );
        parents_address_same_address_element.addEventListener("input", () => {
            this.#renderParentsAddress2();
        });

        await this.#renderParentsAddress2();

        this.#postal_address_form_element = FormElement.new(
            this.#flux_localization_api
        );

        this.#postal_address_form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_POSTAL_ADDRESS
            )
        );

        this.#postal_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_GENERAL_POST_TO_PARENTS
            ),
            "checkbox",
            "parents-address-general-post"
        );

        this.#postal_address_form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_INVOICES_TO_PARENTS
            ),
            "checkbox",
            "parents-address-invoices"
        );

        await this.#postal_address_form_element.addButtons(
            () => {
                this.#filledPersonalData();
            },
            this.#back_function
        );

        this.#parents_address_form_element.after(this.#postal_address_form_element);
    }

    /**
     * @returns {Promise<void>}
     */
    async #renderParentsAddress2() {
        this.#parents_address_form_element.inputs["parents-address-country"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-extra-address-line"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-street"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-house-number"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-postal-code"]?.parentElement?.remove();

        this.#parents_address_form_element.inputs["parents-address-place"]?.parentElement?.remove();

        if (this.#parents_address_form_element.inputs["parents-address"].checked && !this.#parents_address_form_element.inputs["parents-address-same-address"].checked) {
            const parents_address_country_element = this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_COUNTRY
                ),
                "select",
                "parents-address-country"
            );
            parents_address_country_element.required = true;

            for (const country of this.#personal_data.countries) {
                const option_element = document.createElement("option");
                option_element.text = await this.#label_service.getCountryLabel(
                    country
                );
                option_element.value = country.id;
                parents_address_country_element.append(option_element);
            }

            this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_EXTRA_ADDRESS_LINE_E_G_EXAMPLE,
                    {
                        example: this.#personal_data["extra-address-line-example"]
                    }
                ),
                "text",
                "parents-address-extra-address-line"
            );

            const parents_address_street_element = this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_STREET
                ),
                "text",
                "parents-address-street"
            );
            parents_address_street_element.required = true;

            const parents_address_house_number_element = this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_APPARTEMENT_HOUSE_NUMBER
                ),
                "number",
                "parents-address-house-number"
            );
            parents_address_house_number_element.inputMode = "numeric";
            parents_address_house_number_element.max = this.#personal_data["max-house-number"];
            parents_address_house_number_element.min = this.#personal_data["min-house-number"];
            parents_address_house_number_element.required = true;
            parents_address_house_number_element.step = 1;

            const parents_address_postal_code_element = this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_POSTAL_CODE
                ),
                "number",
                "parents-address-postal-code"
            );
            parents_address_postal_code_element.inputMode = "numeric";
            parents_address_postal_code_element.max = this.#personal_data["max-postal-code"];
            parents_address_postal_code_element.min = this.#personal_data["min-postal-code"];
            parents_address_postal_code_element.required = true;
            parents_address_postal_code_element.step = 1;

            const parents_address_place_element = this.#parents_address_form_element.addInput(
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_PLACE
                ),
                "select",
                "parents-address-place"
            );
            parents_address_place_element.required = true;

            for (const place of this.#personal_data.places) {
                const option_element = document.createElement("option");
                option_element.text = await this.#label_service.getPlaceLabel(
                    place
                );
                option_element.value = place.id;
                parents_address_place_element.append(option_element);
            }

            parents_address_postal_code_element.addEventListener("input", () => {
                if (parents_address_postal_code_element.value === "" || parents_address_place_element.value !== "") {
                    return;
                }

                const place = this.#personal_data.places.find(_place => _place["postal-code"] === parents_address_postal_code_element.valueAsNumber) ?? null;
                if (place === null) {
                    return;
                }

                parents_address_place_element.value = place.id;
            });
            parents_address_place_element.addEventListener("input", () => {
                if (parents_address_place_element.value === "" || parents_address_postal_code_element.value !== "") {
                    return;
                }

                const place = this.#personal_data.places.find(_place => _place.id === parents_address_place_element.value) ?? null;
                if (place === null) {
                    return;
                }

                parents_address_postal_code_element.valueAsNumber = place["postal-code"];
            });
        }
    }

    /**
     * @param {string} phone_type
     * @returns {Promise<void>}
     */
    async #renderPhoneNumberFormat(phone_type) {
        let phone_title_key;
        switch (phone_type) {
            case "business":
                phone_title_key = LOCALIZATION_KEY_PHONE_BUSINESS;
                break;

            case "home":
                phone_title_key = LOCALIZATION_KEY_PHONE_HOME;
                break;

            case "mobile":
                phone_title_key = LOCALIZATION_KEY_PHONE_MOBILE;
                break;

            default:
                return;
        }

        const phone_title = await this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            phone_title_key
        );

        this.#contact_form_element.inputs[`${phone_type}-phone-number`].removeAttribute("pattern");
        this.#contact_form_element.inputs[`${phone_type}-phone-number`].parentElement.nextElementSibling.innerText = phone_title;

        const area_code = this.#personal_data["area-codes"].find(_area_code => _area_code.id === this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value) ?? null;

        if (area_code === null) {
            return;
        }

        this.#contact_form_element.inputs[`${phone_type}-phone-number`].pattern = (await valueToRegExp(
            area_code["phone-number-format"],
            true
        )).source;
        this.#contact_form_element.inputs[`${phone_type}-phone-number`].parentElement.nextElementSibling.innerText = await this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_PHONE_TITLE_PHONE_NUMBER_FORMAT,
            {
                "phone-title": phone_title,
                "phone-number-format": await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_FORMAT_EXAMPLE,
                    {
                        example: area_code["phone-number-example"]
                    }
                )
            }
        );
    }
}

export const PERSONAL_DATA_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_PERSONAL_DATA}`;

customElements.define(PERSONAL_DATA_ELEMENT_TAG_NAME, PersonalDataElement);
