import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PERSONAL_DATA } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("./filledPersonalDataFunction.mjs").filledPersonalDataFunction} filledPersonalDataFunction */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./PersonalData.mjs").PersonalData} PersonalData */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

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
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {filledPersonalDataFunction}
     */
    #filled_personal_data_function;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {FormElement}
     */
    #origin_place_form_element;
    /**
     * @type {FormElement}
     */
    #parent_address_form_element;
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
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PersonalData} personal_data
     * @param {filledPersonalDataFunction} filled_personal_data_function
     * @param {backFunction | null} back_function
     * @returns {PersonalDataElement}
     */
    static new(css_api, label_service, localization_api, personal_data, filled_personal_data_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            personal_data,
            filled_personal_data_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PersonalData} personal_data
     * @param {filledPersonalDataFunction} filled_personal_data_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, personal_data, filled_personal_data_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#personal_data = personal_data;
        this.#filled_personal_data_function = filled_personal_data_function;
        this.#back_function = back_function;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @returns {Promise<void>}
     */
    async #filledPersonalData() {
        if (!this.#address_form_element.validate() || !this.#contact_form_element.validate() || !this.#personal_information_form_element.validate() || !this.#origin_place_form_element.validate() || !this.#parent_address_form_element.validate()) {
            return;
        }

        const post_result = await this.#filled_personal_data_function(
            {
                salutation: this.#address_form_element.inputs.salutation.value,
                "first-name": this.#address_form_element.inputs["first-name"].value,
                "second-first-name": this.#address_form_element.inputs["second-first-name"].value,
                "additional-first-names": this.#address_form_element.getTextareaValue(
                    "additional-first-names"
                ).split("\n").filter(name => name !== ""),
                "last-name": this.#address_form_element.inputs["last-name"].value,
                "registration-number": this.#address_form_element.inputs["registration-number"].value,
                country: this.#address_form_element.inputs.country.value,
                "extra-address-line": this.#address_form_element.inputs["extra-address-line"].value,
                street: this.#address_form_element.inputs.street.value,
                "house-number": this.#address_form_element.inputs["house-number"].valueAsNumber,
                "postal-office-box": this.#address_form_element.inputs["postal-office-box"].value,
                "postal-code": this.#address_form_element.inputs["postal-code"].valueAsNumber,
                place: this.#address_form_element.inputs.place.value,
                "phone-area-code": this.#contact_form_element.inputs["phone-area-code"].value,
                phone: this.#contact_form_element.inputs.phone.value,
                "mobile-area-code": this.#contact_form_element.inputs["mobile-area-code"].value,
                mobile: this.#contact_form_element.inputs.mobile.value,
                email: this.#contact_form_element.inputs.email.value,
                "mother-language": this.#contact_form_element.inputs["mother-language"].value,
                "correspondence-language": this.#contact_form_element.inputs["correspondence-language"].value,
                "birth-date": this.#personal_information_form_element.inputs["birth-date"].value,
                "old-age-survivar-insurance-number": this.#personal_information_form_element.inputs["old-age-survivar-insurance-number"].value,
                nationally: this.#personal_information_form_element.inputs.nationally.value,
                "origin-place": this.#origin_place_form_element.inputs["origin-place"].value,
                "parent-address": this.#parent_address_form_element.inputs["parent-address"].checked
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#parent_address_form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#parent_address_form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#parent_address_form_element.addInvalidMessage(
            this.#localization_api.translate(
                "Please check your data!"
            )
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Personal data"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            this.#localization_api.translate(
                "Please pay attention to use the correct spelling (Upper and lower case letters)"
            )
        ));

        this.#address_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            () => {
                const additional_first_names = this.#address_form_element.getTextareaValue(
                    "additional-first-names"
                );
                if (additional_first_names !== "" && additional_first_names.split("\n").some(name => name === "")) {
                    this.#address_form_element.setCustomValidationMessage(
                        this.#address_form_element.inputs["additional-first-names"],
                        this.#localization_api.translate(
                            "Some line contains no name!"
                        )
                    );
                    return false;
                }

                if (this.#contact_form_element.inputs["phone-area-code"].value === "" && this.#contact_form_element.inputs.phone.value !== "") {
                    this.#contact_form_element.setCustomValidationMessage(
                        this.#contact_form_element.inputs["phone-area-code"],
                        this.#localization_api.translate(
                            "Please either enter both area code/number or neither of them!"
                        )
                    );
                    return false;
                }

                if (this.#contact_form_element.inputs["phone-area-code"].value !== "" && this.#contact_form_element.inputs.phone.value === "") {
                    this.#contact_form_element.setCustomValidationMessage(
                        this.#contact_form_element.inputs.phone,
                        this.#localization_api.translate(
                            "Please either enter both area code/number or neither of them!"
                        )
                    );
                    return false;
                }

                if (this.#contact_form_element.inputs["mobile-area-code"].value === "" && this.#contact_form_element.inputs.mobile.value !== "") {
                    this.#contact_form_element.setCustomValidationMessage(
                        this.#contact_form_element.inputs["mobile-area-code"],
                        this.#localization_api.translate(
                            "Please either enter both area code/number or neither of them!"
                        )
                    );
                    return false;
                }

                if (this.#contact_form_element.inputs["mobile-area-code"].value !== "" && this.#contact_form_element.inputs.mobile.value === "") {
                    this.#contact_form_element.setCustomValidationMessage(
                        this.#contact_form_element.inputs.mobile,
                        this.#localization_api.translate(
                            "Please either enter both area code/number or neither of them!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#address_form_element.addTitle(
            this.#localization_api.translate(
                "Address"
            )
        );

        const salutation_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Salutation"
            ),
            "select",
            "salutation"
        );
        salutation_element.required = true;

        for (const salutation of this.#personal_data.salutations) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getSalutationLabel(
                salutation
            );
            option_element.value = salutation.id;
            salutation_element.appendChild(option_element);
        }

        const first_name_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "First name"
            ),
            "text",
            "first-name"
        );
        first_name_element.required = true;

        const second_first_name_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Second first name"
            ),
            "text",
            "second-first-name"
        );

        const additional_first_names_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Additional first names (One per line)"
            ),
            "textarea",
            "additional-first-names"
        );

        const last_name_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Last name"
            ),
            "text",
            "last-name"
        );
        last_name_element.required = true;

        const registration_number_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Registration number (Format {example})",
                null,
                {
                    example: this.#personal_data["registration-number-example"]
                }
            ),
            "text",
            "registration-number"
        );
        registration_number_element.pattern = this.#personal_data["registration-number-format"].substring(1, this.#personal_data["registration-number-format"].length - 1);

        const country_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Country"
            ),
            "select",
            "country"
        );
        country_element.required = true;

        for (const country of this.#personal_data.countries) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            country_element.appendChild(option_element);
        }

        const extra_address_line_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Extra address line (E.g. {example})",
                null,
                {
                    example: this.#personal_data["extra-address-line-example"]
                }
            ),
            "text",
            "extra-address-line"
        );

        const street_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Street"
            ),
            "text",
            "street"
        );
        street_element.required = true;

        const house_number_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Appartement/House number"
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
            this.#localization_api.translate(
                "Postal office box (Format {example})",
                null,
                {
                    example: this.#personal_data["postal-office-box-example"]
                }
            ),
            "text",
            "postal-office-box"
        );
        postal_office_box_element.pattern = this.#personal_data["postal-office-box-format"].substring(1, this.#personal_data["postal-office-box-format"].length - 1);

        const postal_code_element = this.#address_form_element.addInput(
            this.#localization_api.translate(
                "Postal code"
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
            this.#localization_api.translate(
                "Place"
            ),
            "select",
            "place"
        );
        place_element.required = true;

        for (const place of this.#personal_data.places) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            place_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#address_form_element);

        this.#contact_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#contact_form_element.addTitle(
            this.#localization_api.translate(
                "Contact"
            )
        );

        const phone_area_code_element = this.#contact_form_element.addInput(
            this.#localization_api.translate(
                "Phone (Format {example})",
                null,
                {
                    example: this.#personal_data["phone-example"]
                }
            ),
            "select",
            "phone-area-code",
            false,
            true
        );
        phone_area_code_element.dataset.small = true;
        phone_area_code_element.required = this.#personal_data["required-phone"];

        for (const area_code of this.#personal_data["area-codes"]) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getAreaCodeLabel(
                area_code
            );
            option_element.value = area_code.id;
            phone_area_code_element.appendChild(option_element);
        }

        const phone_element = this.#contact_form_element.addInput(
            "",
            "text",
            "phone"
        );
        phone_element.inputMode = "tel";
        phone_element.pattern = this.#personal_data["phone-format"].substring(1, this.#personal_data["phone-format"].length - 1);
        phone_element.required = this.#personal_data["required-phone"];

        phone_element.parentElement.remove();
        phone_area_code_element.insertAdjacentElement("afterend", phone_element);

        const mobile_area_code_element = this.#contact_form_element.addInput(
            this.#localization_api.translate(
                "Mobile (Format {example})",
                null,
                {
                    example: this.#personal_data["phone-example"]
                }
            ),
            "select",
            "mobile-area-code",
            false,
            true
        );
        mobile_area_code_element.dataset.small = true;
        mobile_area_code_element.required = this.#personal_data["required-mobile"];

        for (const area_code of this.#personal_data["area-codes"]) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getAreaCodeLabel(
                area_code
            );
            option_element.value = area_code.id;
            mobile_area_code_element.appendChild(option_element);
        }

        const mobile_element = this.#contact_form_element.addInput(
            "",
            "text",
            "mobile"
        );
        mobile_element.inputMode = "tel";
        mobile_element.pattern = this.#personal_data["phone-format"].substring(1, this.#personal_data["phone-format"].length - 1);
        mobile_element.required = this.#personal_data["required-mobile"];

        mobile_element.parentElement.remove();
        mobile_area_code_element.insertAdjacentElement("afterend", mobile_element);

        const email_element = this.#contact_form_element.addInput(
            this.#localization_api.translate(
                "E-Mail"
            ),
            "email",
            "email"
        );
        email_element.required = this.#personal_data["required-email"];

        const mother_language_element = this.#contact_form_element.addInput(
            this.#localization_api.translate(
                "Mother language"
            ),
            "select",
            "mother-language"
        );
        mother_language_element.required = true;

        for (const language of this.#personal_data.languages) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getLanguageLabel(
                language
            );
            option_element.value = language.id;
            mother_language_element.appendChild(option_element);
        }

        const correspondence_language_element = this.#contact_form_element.addInput(
            this.#localization_api.translate(
                "Correspondence language"
            ),
            "select",
            "correspondence-language"
        );
        correspondence_language_element.required = true;

        for (const language of this.#personal_data.languages) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getLanguageLabel(
                language
            );
            option_element.value = language.id;
            correspondence_language_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#contact_form_element);

        this.#personal_information_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#personal_information_form_element.addTitle(
            this.#localization_api.translate(
                "Personal information"
            )
        );

        const birth_date_element = this.#personal_information_form_element.addInput(
            this.#localization_api.translate(
                "Birth date"
            ),
            "date",
            "birth-date"
        );
        birth_date_element.max = this.#personal_data["max-birth-date"];
        birth_date_element.min = this.#personal_data["min-birth-date"];
        birth_date_element.required = true;

        const old_age_survivar_insurance_number_element = this.#personal_information_form_element.addInput(
            this.#localization_api.translate(
                "Swiss old-age and survivar insurance number ({ahv}/{oasi}) (Format {example})",
                null,
                {
                    ahv: "AHV",
                    oasi: "OASI",
                    example: this.#personal_data["old-age-survivar-insurance-number-example"]
                }
            ),
            "text",
            "old-age-survivar-insurance-number"
        );
        old_age_survivar_insurance_number_element.pattern = this.#personal_data["old-age-survivar-insurance-number-format"].substring(1, this.#personal_data["old-age-survivar-insurance-number-format"].length - 1);

        const nationally_element = this.#personal_information_form_element.addInput(
            this.#localization_api.translate(
                "Nationally"
            ),
            "select",
            "nationally"
        );
        nationally_element.required = true;

        for (const country of this.#personal_data.countries) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            nationally_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#personal_information_form_element);

        this.#origin_place_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#origin_place_form_element.addTitle(
            this.#localization_api.translate(
                "Origin place"
            )
        );

        const origin_place_element = this.#origin_place_form_element.addInput(
            this.#localization_api.translate(
                "Origin place"
            ),
            "select",
            "origin-place"
        );
        origin_place_element.required = true;

        for (const place of this.#personal_data.places) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            origin_place_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#origin_place_form_element);

        this.#parent_address_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#parent_address_form_element.addTitle(
            this.#localization_api.translate(
                "Parent address"
            )
        );

        const parent_address_element = this.#parent_address_form_element.addInput(
            this.#localization_api.translate(
                "Parent address"
            ),
            "checkbox",
            "parent-address"
        );

        this.#parent_address_form_element.addButtons(
            () => {
                this.#filledPersonalData();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#parent_address_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
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

            phone_area_code_element.value = this.#personal_data.values["phone-area-code"];

            phone_element.value = this.#personal_data.values.phone;

            mobile_area_code_element.value = this.#personal_data.values["mobile-area-code"];

            mobile_element.value = this.#personal_data.values.mobile;

            email_element.value = this.#personal_data.values.email;

            mother_language_element.value = this.#personal_data.values["mother-language"];

            correspondence_language_element.value = this.#personal_data.values["correspondence-language"];

            birth_date_element.value = this.#personal_data.values["birth-date"];

            old_age_survivar_insurance_number_element.value = this.#personal_data.values["old-age-survivar-insurance-number"];

            nationally_element.value = this.#personal_data.values.nationally;

            origin_place_element.value = this.#personal_data.values["origin-place"];

            parent_address_element.checked = this.#personal_data.values["parent-address"];
        }
    }
}

export const PERSONAL_DATA_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_PERSONAL_DATA}`;

customElements.define(PERSONAL_DATA_ELEMENT_TAG_NAME, PersonalDataElement);
