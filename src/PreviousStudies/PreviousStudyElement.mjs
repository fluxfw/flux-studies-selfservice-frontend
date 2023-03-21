import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { FormElement } from "../Form/FormElement.mjs";

/** @typedef {import("./ChosenPreviousStudy.mjs").ChosenPreviousStudy} ChosenPreviousStudy */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./PreviousStudies.mjs").PreviousStudies} PreviousStudies */
/** @typedef {import("./removePreviousStudyFunction.mjs").removePreviousStudyFunction} removePreviousStudyFunction */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

const css = await flux_css_api.import(
    `${__dirname}/PreviousStudyElement.css`
);

export class PreviousStudyElement extends HTMLElement {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {PreviousStudies}
     */
    #previous_studies;
    /**
     * @type {removePreviousStudyFunction}
     */
    #remove_previous_study_function;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {ChosenPreviousStudy | null}
     */
    #values;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PreviousStudies} previous_studies
     * @param {removePreviousStudyFunction} remove_previous_study_function
     * @param {ChosenPreviousStudy | null} values
     * @returns {PreviousStudyElement}
     */
    static new(flux_localization_api, label_service, previous_studies, remove_previous_study_function, values = null) {
        return new this(
            flux_localization_api,
            label_service,
            previous_studies,
            remove_previous_study_function,
            values
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {LabelService} label_service
     * @param {PreviousStudies} previous_studies
     * @param {removePreviousStudyFunction} remove_previous_study_function
     * @param {ChosenPreviousStudy | null} values
     * @private
     */
    constructor(flux_localization_api, label_service, previous_studies, remove_previous_study_function, values) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#label_service = label_service;
        this.#previous_studies = previous_studies;
        this.#remove_previous_study_function = remove_previous_study_function;
        this.#values = values;

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @returns {ChosenPreviousStudy}
     */
    getValues() {
        return {
            "certificate-type": this.#form_element.inputs["certificate-type"].value,
            "start-date": this.#form_element.inputs["start-date"].valueAsNumber,
            "end-date": this.#form_element.inputs["end-date"].valueAsNumber,
            university: this.#form_element.inputs.university.value,
            subject: this.#form_element.inputs.subject.value,
            semesters: this.#form_element.inputs.semesters.valueAsNumber,
            "degree-title": this.#form_element.inputs["degree-title"].value,
            "certificate-country": this.#form_element.inputs["certificate-country"].value,
            "certificate-canton": this.#form_element.inputs["certificate-canton"].value,
            "certificate-place": this.#form_element.inputs["certificate-place"].value
        };
    }

    /**
     * @returns {Promise<boolean>}
     */
    async validate() {
        return this.#form_element.validate();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                if (this.#form_element.inputs["end-date"].valueAsNumber < this.#form_element.inputs["start-date"].valueAsNumber) {
                    this.#form_element.setCustomValidationMessage(
                        this.#form_element.inputs["end-date"],
                        await this.#flux_localization_api.translate(
                            "The end date can not be before the start date!"
                        )
                    );
                    return false;
                }

                return true;
            }
        );

        const title_element = this.#form_element.addTitle(
            await this.#flux_localization_api.translate(
                "Previous study"
            )
        );

        const remove_previous_study_element = FormButtonElement.new(
            "X"
        );
        remove_previous_study_element.button.addEventListener("click", () => {
            this.#remove_previous_study_function();
        });
        title_element.addElement(
            remove_previous_study_element
        );

        const certificate_type_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Type of certificate"
            ),
            "select",
            "certificate-type"
        );
        certificate_type_element.required = true;

        for (const certificate_type of this.#previous_studies["certificate-types"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCertificateTypeLabel(
                certificate_type
            );
            option_element.value = certificate_type.id;
            certificate_type_element.appendChild(option_element);
        }

        const start_date_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
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
            await this.#flux_localization_api.translate(
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
            await this.#flux_localization_api.translate(
                "Name of university"
            ),
            "select",
            "university"
        );
        university_element.required = true;

        for (const school of this.#previous_studies.schools) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getSchoolLabel(
                school
            );
            option_element.value = school.id;
            university_element.appendChild(option_element);
        }

        const subject_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Subject studied"
            ),
            "text",
            "subject"
        );
        subject_element.required = true;

        const semesters_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
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

        const degree_title_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Title degree"
            ),
            "select",
            "degree-title"
        );
        degree_title_element.required = true;

        for (const degree_title of this.#previous_studies["degree-titles"]) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getDegreeTitleLabel(
                degree_title
            );
            option_element.value = degree_title.id;
            degree_title_element.appendChild(option_element);
        }

        const certificate_country_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "The country where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-country"
        );
        certificate_country_element.required = true;

        for (const country of this.#previous_studies.countries) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCountryLabel(
                country
            );
            option_element.value = country.id;
            certificate_country_element.appendChild(option_element);
        }

        const certificate_canton_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "The canton of your political commune where you were registered at the time you were awarded your certificate"
            ),
            "select",
            "certificate-canton"
        );
        certificate_canton_element.required = true;

        for (const canton of this.#previous_studies.cantons) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getCantonLabel(
                canton
            );
            option_element.value = canton.id;
            certificate_canton_element.appendChild(option_element);
        }

        const certificate_place_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                "Legal place of residence when the certificate was awarded"
            ),
            "select",
            "certificate-place"
        );
        certificate_place_element.required = true;

        for (const place of this.#previous_studies.places) {
            const option_element = document.createElement("option");
            option_element.text = await this.#label_service.getPlaceLabel(
                place
            );
            option_element.value = place.id;
            certificate_place_element.appendChild(option_element);
        }

        this.#shadow.appendChild(this.#form_element);

        if (this.#values !== null) {
            certificate_type_element.value = this.#values["certificate-type"];

            start_date_element.valueAsNumber = this.#values["start-date"];

            end_date_element.valueAsNumber = this.#values["end-date"];

            university_element.value = this.#values.university;

            subject_element.value = this.#values.subject;

            semesters_element.valueAsNumber = this.#values.semesters;

            degree_title_element.value = this.#values["degree-title"];

            certificate_country_element.value = this.#values["certificate-country"];

            certificate_canton_element.value = this.#values["certificate-canton"];

            certificate_place_element.value = this.#values["certificate-place"];
        }
    }
}

export const PREVIOUS_STUDY_ELEMENT_TAG_NAME = "flux-studis-selfservice-previous-study";

customElements.define(PREVIOUS_STUDY_ELEMENT_TAG_NAME, PreviousStudyElement);
