import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PREVIOUS_STUDIES } from "../Page/PAGE.mjs";
import { SubtitleElement } from "../Subtitle/SubtitleElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenPreviousStudiesFunction.mjs").chosenPreviousStudiesFunction} chosenPreviousStudiesFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./PreviousStudies.mjs").PreviousStudies} PreviousStudies */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PreviousStudiesElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenPreviousStudiesFunction}
     */
    #chosen_previous_studies_function;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {PreviousStudies}
     */
    #previous_studies;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @returns {PreviousStudiesElement}
     */
    static new(css_api, label_service, localization_api, previous_studies, chosen_previous_studies, back_function = null) {
        return new this(
            css_api,
            label_service,
            localization_api,
            previous_studies,
            chosen_previous_studies,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {LocalizationApi} localization_api
     * @param {PreviousStudies} previous_studies
     * @param {chosenPreviousStudiesFunction} chosen_previous_studies
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, localization_api, previous_studies, chosen_previous_studies, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#localization_api = localization_api;
        this.#previous_studies = previous_studies;
        this.#chosen_previous_studies_function = chosen_previous_studies;
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
    async #chosenPreviousStudies() {
        if (!this.#form_element.validate()) {
            return;
        }

        const post_result = await this.#chosen_previous_studies_function(
            {
                "previous-studies": [
                    {
                        "certificate-type": this.#form_element.inputs["certificate-type"].value,
                        "start-date": this.#form_element.inputs["start-date"].valueAsNumber,
                        "end-date": this.#form_element.inputs["end-date"].valueAsNumber,
                        university: this.#form_element.inputs.university.value,
                        subject: this.#form_element.inputs.subject.value,
                        semesters: this.#form_element.inputs.semesters.valueAsNumber,
                        degree: this.#form_element.inputs.degree.value,
                        "certificate-country": this.#form_element.inputs["certificate-country"].value,
                        "certificate-canton": this.#form_element.inputs["certificate-canton"].value,
                        "certificate-place": this.#form_element.inputs["certificate-place"].value
                    }
                ]
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["network-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Network error!"
                )
            );
            return;
        }

        if (post_result["server-error"]) {
            this.#form_element.addInvalidMessage(
                this.#localization_api.translate(
                    "Server error!"
                )
            );
            return;
        }

        this.#form_element.addInvalidMessage(
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
                "Your previous studies"
            )
        ));

        this.#form_element = FormElement.new(
            this.#css_api,
            this.#localization_api,
            () => {
                if (this.#form_element.inputs["end-date"].valueAsNumber < this.#form_element.inputs["start-date"].valueAsNumber) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs["end-date"],
                        this.#localization_api.translate(
                            "The end date can not be before the start date!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        this.#form_element.addTitle(
            this.#localization_api.translate(
                "Previous studies"
            )
        );

        this.#form_element.addSubtitle(
            this.#localization_api.translate(
                "Please indicate all your university studies even if you did not complete them"
            )
        );

        const certificate_type_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Type of certificate"
            ),
            "select",
            "certificate-type"
        );
        certificate_type_element.required = true;

        for (const certificate_type of this.#previous_studies["certificate-types"]) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCertificateTypeLabel(
                certificate_type
            );
            option_element.value = certificate_type.id;
            certificate_type_element.appendChild(option_element);
        }

        const start_date_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Start of your studies (Year)"
            ),
            "number",
            "start-date"
        );
        start_date_element.inputMode = "numeric";
        start_date_element.max = this.#previous_studies["max-start-date"];
        start_date_element.min = this.#previous_studies["min-start-date"];
        start_date_element.required = true;
        start_date_element.step = 1;

        const end_date_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "End of your studies (Year)"
            ),
            "number",
            "end-date"
        );
        end_date_element.inputMode = "numeric";
        end_date_element.max = this.#previous_studies["max-end-date"];
        end_date_element.min = this.#previous_studies["min-end-date"];
        end_date_element.required = true;
        end_date_element.step = 1;

        const university_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Name of university"
            ),
            "select",
            "university"
        );
        university_element.required = true;

        for (const school of this.#previous_studies.schools) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getSchoolLabel(
                school
            );
            option_element.value = school.id;
            university_element.appendChild(option_element);
        }

        const subject_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Subject studied"
            ),
            "text",
            "subject"
        );
        subject_element.required = true;

        const semesters_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Number of semesters"
            ),
            "number",
            "semesters"
        );
        semesters_element.inputMode = "numeric";
        semesters_element.max = this.#previous_studies["max-semesters"];
        semesters_element.min = this.#previous_studies["min-semesters"];
        semesters_element.required = true;
        semesters_element.step = 1;

        const degree_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Title degree"
            ),
            "select",
            "degree"
        );
        degree_element.required = true;

        for (const degree of this.#previous_studies.degrees) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getDegreeLabel(
                degree
            );
            option_element.value = degree.id;
            degree_element.appendChild(option_element);
        }

        const certificate_country_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "The country where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-country"
        );
        certificate_country_element.required = true;

        for (const country of this.#previous_studies.countries) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            certificate_country_element.appendChild(option_element);
        }

        const certificate_canton_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "The canton of your political commune where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-canton"
        );
        certificate_canton_element.required = true;

        for (const canton of this.#previous_studies.cantons) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            certificate_canton_element.appendChild(option_element);
        }

        const certificate_place_element = this.#form_element.addInput(
            this.#localization_api.translate(
                "Legal place of residence when the certificate was awarded"
            ),
            "select",
            "certificate-place"
        );
        certificate_place_element.required = true;

        for (const place of this.#previous_studies.places) {
            const option_element = document.createElement("option");
            option_element.text = this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            certificate_place_element.appendChild(option_element);
        }

        this.#form_element.addButtons(
            () => {
                this.#chosenPreviousStudies();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api,
            this.#localization_api
        ));

        this.#shadow.appendChild(SubtitleElement.new(
            this.#css_api,
            "TODO multiple"
        ));

        if (this.#previous_studies.values !== null) {
            for (const previous_study of this.#previous_studies.values["previous-studies"]) {
                certificate_type_element.value = previous_study["certificate-type"];

                start_date_element.valueAsNumber = previous_study["start-date"];

                end_date_element.valueAsNumber = previous_study["end-date"];

                university_element.value = previous_study.university;

                subject_element.value = previous_study.subject;

                semesters_element.valueAsNumber = previous_study.semesters;

                degree_element.value = previous_study.degree;

                certificate_country_element.value = previous_study["certificate-country"];

                certificate_canton_element.value = previous_study["certificate-canton"];

                certificate_place_element.value = previous_study["certificate-place"];
                break;
            }
        }
    }
}

export const PREVIOUS_STUDIES_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_PREVIOUS_STUDIES}`;

customElements.define(PREVIOUS_STUDIES_ELEMENT_TAG_NAME, PreviousStudiesElement);
