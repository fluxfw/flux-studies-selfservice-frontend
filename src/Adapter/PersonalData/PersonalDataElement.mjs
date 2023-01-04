import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PERSONAL_DATA } from "../Page/PAGE.mjs";
import { PHONE_TYPES } from "./PHONE_TYPES.mjs";
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
        if (!await this.#address_form_element.validate() || !await this.#contact_form_element.validate() || !await this.#personal_information_form_element.validate() || !await this.#origin_place_form_element.validate() || !await this.#parents_address_form_element.validate() || !(this.#postal_address_form_element !== null ? await this.#postal_address_form_element.validate() : true)) {
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
                    "parents-address-first-names": this.#parents_address_form_element.getTextareaValue(
                        "parents-address-first-names"
                    ).split("\n").filter(name => name !== ""),
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
                await this.#localization_api.translate(
                    "Please check your data!"
                )
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            await this.#localization_api.translate(
                "Personal data"
            )
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            await this.#localization_api.translate(
                "Please pay attention to use the correct spelling (Upper and lower case letters)"
            )
        ));

        this.#address_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            async () => {
                const additional_first_names = this.#address_form_element.getTextareaValue(
                    "additional-first-names"
                );
                if (additional_first_names !== "" && additional_first_names.split("\n").some(name => name === "")) {
                    this.#address_form_element.setCustomValidationMessage(
                        this.#address_form_element.inputs["additional-first-names"],
                        await this.#localization_api.translate(
                            "Some line contains no name!"
                        )
                    );
                    return false;
                }

                if (this.#address_form_element.inputs["postal-code"].valueAsNumber !== this.#personal_data.places.find(place => place.id === this.#address_form_element.inputs.place.value)["postal-code"]) {
                    this.#address_form_element.setCustomValidationMessage(
                        this.#address_form_element.inputs["postal-code"],
                        await this.#localization_api.translate(
                            "Postal code and place does not match!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#address_form_element.addTitle(
            await this.#localization_api.translate(
                "Address"
            )
        );

        const salutation_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
                "Salutation"
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
            salutation_element.appendChild(option_element);
        }

        const first_name_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
                "First name"
            ),
            "text",
            "first-name"
        );
        first_name_element.required = true;

        const second_first_name_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
                "Second first name"
            ),
            "text",
            "second-first-name"
        );

        const additional_first_names_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
                "Additional first names (One per line)"
            ),
            "textarea",
            "additional-first-names"
        );

        const last_name_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
                "Last name"
            ),
            "text",
            "last-name"
        );
        last_name_element.required = true;

        const registration_number_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
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
            await this.#localization_api.translate(
                "Country"
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
            country_element.appendChild(option_element);
        }

        const extra_address_line_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
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
            await this.#localization_api.translate(
                "Street"
            ),
            "text",
            "street"
        );
        street_element.required = true;

        const house_number_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
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
            await this.#localization_api.translate(
                "Postal office box"
            ),
            "text",
            "postal-office-box"
        );

        const postal_code_element = this.#address_form_element.addInput(
            await this.#localization_api.translate(
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
            await this.#localization_api.translate(
                "Place"
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
            place_element.appendChild(option_element);
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

        this.#shadow.appendChild(this.#address_form_element);

        this.#contact_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            async () => {
                for (const phone_type of PHONE_TYPES) {
                    if (this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value === "" && this.#contact_form_element.inputs[`${phone_type}-phone-number`].value !== "") {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${phone_type}-phone-area-code`],
                            await this.#localization_api.translate(
                                "Please either enter both area code/number or neither of them!"
                            )
                        );
                        return false;
                    }

                    if (this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value !== "" && this.#contact_form_element.inputs[`${phone_type}-phone-number`].value === "") {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${phone_type}-phone-number`],
                            await this.#localization_api.translate(
                                "Please either enter both area code/number or neither of them!"
                            )
                        );
                        return false;
                    }
                }

                if (this.#personal_data["required-phone"]) {
                    if (!PHONE_TYPES.some(phone_type => this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value !== "")) {
                        this.#contact_form_element.setCustomValidationMessage(
                            this.#contact_form_element.inputs[`${PHONE_TYPES[0]}-phone-area-code`],
                            await this.#localization_api.translate(
                                "Please enter at least one phone!"
                            )
                        );
                        return false;
                    }
                }

                return true;
            }
        );

        this.#contact_form_element.addTitle(
            await this.#localization_api.translate(
                "Contact"
            )
        );

        for (const phone_type of PHONE_TYPES) {
            const area_code_element = this.#contact_form_element.addInput(
                await this.#localization_api.translate(
                    `Phone ${phone_type} (Format {example})`,
                    null,
                    {
                        example: this.#personal_data["phone-number-example"]
                    }
                ),
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
                area_code_element.appendChild(option_element);
            }

            const number_element = this.#contact_form_element.addInput(
                "",
                "tel",
                `${phone_type}-phone-number`
            );
            number_element.inputMode = "tel";
            number_element.pattern = this.#personal_data["phone-number-format"].substring(1, this.#personal_data["phone-number-format"].length - 1);
            number_element.required = this.#personal_data[`required-phone-${phone_type}`];

            number_element.parentElement.remove();
            area_code_element.insertAdjacentElement("afterend", number_element);
        }

        const email_element = this.#contact_form_element.addInput(
            await this.#localization_api.translate(
                "E-Mail"
            ),
            "email",
            "email"
        );
        email_element.inputMode = "email";
        email_element.required = this.#personal_data["required-email"];

        const mother_language_element = this.#contact_form_element.addInput(
            await this.#localization_api.translate(
                "Mother language"
            ),
            "select",
            "mother-language"
        );
        mother_language_element.required = true;

        for (const language of this.#personal_data.languages) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getLanguageLabel(
                language
            );
            option_element.value = language.id;
            mother_language_element.appendChild(option_element);
        }

        const correspondence_language_element = this.#contact_form_element.addInput(
            await this.#localization_api.translate(
                "Correspondence language"
            ),
            "select",
            "correspondence-language"
        );
        correspondence_language_element.required = true;

        for (const language of this.#personal_data.languages) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getLanguageLabel(
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
            await this.#localization_api.translate(
                "Personal information"
            )
        );

        const birth_date_element = this.#personal_information_form_element.addInput(
            await this.#localization_api.translate(
                "Birth date"
            ),
            "date",
            "birth-date"
        );
        birth_date_element.max = this.#personal_data["max-birth-date"];
        birth_date_element.min = this.#personal_data["min-birth-date"];
        birth_date_element.required = true;

        const old_age_survivar_insurance_number_element = this.#personal_information_form_element.addInput(
            await this.#localization_api.translate(
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
            await this.#localization_api.translate(
                "Nationally"
            ),
            "select",
            "nationally"
        );
        nationally_element.required = true;

        for (const country of this.#personal_data.countries) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCountryLabel(
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
            await this.#localization_api.translate(
                "Origin place"
            )
        );

        const origin_place_element = this.#origin_place_form_element.addInput(
            await this.#localization_api.translate(
                "Origin place"
            ),
            "select",
            "origin-place"
        );
        origin_place_element.required = true;

        for (const place of this.#personal_data.places) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            origin_place_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#origin_place_form_element);

        this.#parents_address_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            async () => {
                if (this.#parents_address_form_element.inputs["parents-address"].checked) {
                    const parents_address_first_names = this.#parents_address_form_element.getTextareaValue(
                        "parents-address-first-names"
                    );
                    if (parents_address_first_names !== "" && parents_address_first_names.split("\n").some(name => name === "")) {
                        this.#parents_address_form_element.setCustomValidationMessage(
                            this.#parents_address_form_element.inputs["parents-address-first-names"],
                            await this.#localization_api.translate(
                                "Some line contains no name!"
                            )
                        );
                        return false;
                    }

                    if (!this.#parents_address_form_element.inputs["parents-address-same-address"].checked) {
                        if (this.#parents_address_form_element.inputs["parents-address-postal-code"].valueAsNumber !== this.#personal_data.places.find(place => place.id === this.#parents_address_form_element.inputs["parents-address-place"].value)["postal-code"]) {
                            this.#parents_address_form_element.setCustomValidationMessage(
                                this.#parents_address_form_element.inputs["parents-address-postal-code"],
                                await this.#localization_api.translate(
                                    "Postal code and place does not match!"
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
            await this.#localization_api.translate(
                "Parents address"
            )
        );

        const parents_address_element = this.#parents_address_form_element.addInput(
            await this.#localization_api.translate(
                "Enter parents address"
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

        this.#shadow.appendChild(this.#parents_address_form_element);

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

            for (const phone_type of PHONE_TYPES) {
                this.#contact_form_element.inputs[`${phone_type}-phone-area-code`].value = this.#personal_data.values[`${phone_type}-phone-area-code`];

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
            await this.#localization_api.translate(
                "Salutation"
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
            parents_address_salutation_element.appendChild(option_element);
        }

        const parents_address_first_names_element = this.#parents_address_form_element.addInput(
            await this.#localization_api.translate(
                "First names (One per line)"
            ),
            "textarea",
            "parents-address-first-names"
        );
        parents_address_first_names_element.required = true;

        const parents_address_last_name_element = this.#parents_address_form_element.addInput(
            await this.#localization_api.translate(
                "Last name"
            ),
            "text",
            "parents-address-last-name"
        );
        parents_address_last_name_element.required = true;

        const parents_address_same_address_element = this.#parents_address_form_element.addInput(
            await this.#localization_api.translate(
                "Your parents have the same address as you"
            ),
            "checkbox",
            "parents-address-same-address"
        );
        parents_address_same_address_element.addEventListener("input", () => {
            this.#renderParentsAddress2();
        });

        await this.#renderParentsAddress2();

        this.#postal_address_form_element = FormElement.new(
            this.#css_api,
            this.#localization_api
        );

        this.#postal_address_form_element.addTitle(
            await this.#localization_api.translate(
                "Postal address"
            )
        );

        this.#postal_address_form_element.addInput(
            await this.#localization_api.translate(
                "General post to parents"
            ),
            "checkbox",
            "parents-address-general-post"
        );

        this.#postal_address_form_element.addInput(
            await this.#localization_api.translate(
                "Invoices to parents"
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

        this.#parents_address_form_element.insertAdjacentElement("afterend", this.#postal_address_form_element);
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
                await this.#localization_api.translate(
                    "Country"
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
                parents_address_country_element.appendChild(option_element);
            }

            this.#parents_address_form_element.addInput(
                await this.#localization_api.translate(
                    "Extra address line (E.g. {example})",
                    null,
                    {
                        example: this.#personal_data["extra-address-line-example"]
                    }
                ),
                "text",
                "parents-address-extra-address-line"
            );

            const parents_address_street_element = this.#parents_address_form_element.addInput(
                await this.#localization_api.translate(
                    "Street"
                ),
                "text",
                "parents-address-street"
            );
            parents_address_street_element.required = true;

            const parents_address_house_number_element = this.#parents_address_form_element.addInput(
                await this.#localization_api.translate(
                    "Appartement/House number"
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
                await this.#localization_api.translate(
                    "Postal code"
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
                await this.#localization_api.translate(
                    "Place"
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
                parents_address_place_element.appendChild(option_element);
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
}

export const PERSONAL_DATA_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_PERSONAL_DATA}`;

customElements.define(PERSONAL_DATA_ELEMENT_TAG_NAME, PersonalDataElement);
