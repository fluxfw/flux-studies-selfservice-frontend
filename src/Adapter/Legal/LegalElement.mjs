import { ELEMENT_TAG_NAME_PREFIX } from "../Element/ELEMENT_TAG_NAME_PREFIX.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_LEGAL } from "../Page/PAGE.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";

/** @typedef {import("./acceptedLegalFunction.mjs").acceptedLegalFunction} acceptedLegalFunction */
/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./Legal.mjs").Legal} Legal */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class LegalElement extends HTMLElement {
    /**
     * @type {acceptedLegalFunction}
     */
    #accepted_legal_function;
    /**
     * @type {FormElement}
     */
    #agb_form_element;
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {FormElement}
     */
    #comments_form_element;
    /**
     * @type {FormElement}
     */
    #complete_form_element;
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {FormElement}
     */
    #degree_program_form_element;
    /**
     * @type {FormElement}
     */
    #disqualification_form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {Legal}
     */
    #legal;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @returns {LegalElement}
     */
    static new(css_api, label_service, legal, accepted_legal_function, back_function = null) {
        return new this(
            css_api,
            label_service,
            legal,
            accepted_legal_function,
            back_function
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LabelService} label_service
     * @param {Legal} legal
     * @param {acceptedLegalFunction} accepted_legal_function
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(css_api, label_service, legal, accepted_legal_function, back_function) {
        super();

        this.#css_api = css_api;
        this.#label_service = label_service;
        this.#legal = legal;
        this.#accepted_legal_function = accepted_legal_function;
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
    async #acceptedLegal() {
        if (!this.#degree_program_form_element.validate() || !this.#disqualification_form_element.validate() || !this.#agb_form_element.validate() || !this.#complete_form_element.validate() || !this.#comments_form_element.validate()) {
            return;
        }

        const post_result = await this.#accepted_legal_function(
            {
                "non-disqualified": this.#disqualification_form_element.inputs["non-disqualified"].checked,
                agb: this.#agb_form_element.inputs.agb.checked,
                complete: this.#complete_form_element.inputs.complete.checked,
                comments: this.#comments_form_element.inputs.comments.value.replaceAll("\r\n", "\n").replaceAll("\r", "\n")
            }
        );

        if (post_result.ok) {
            return;
        }

        this.#degree_program_form_element.addInvalidMessage(
            "Please check your data"
        );
    }

    /**
     * @returns {void}
     */
    #render() {
        this.#shadow.appendChild(TitleElement.new(
            this.#css_api,
            "Legal"
        ));

        this.#degree_program_form_element = FormElement.new(
            this.#css_api
        );

        this.#degree_program_form_element.addTitle(
            "Intended Degree Program"
        );

        const subject_element = this.#degree_program_form_element.addInput(
            "Subject",
            "readonly"
        );
        subject_element.innerText = this.#label_service.getSubjectLabel(
            this.#legal.subject
        );

        const combination_element = this.#degree_program_form_element.addInput(
            "Combination of Subjects",
            "readonly"
        );
        combination_element.innerText = this.#label_service.getCombinationLabel(
            this.#legal.combination
        );

        const mandatory_element = this.#degree_program_form_element.addInput(
            "Mandatory Subjects",
            "readonly"
        );
        mandatory_element.innerText = this.#label_service.getMultipleMandatoryLabel(
            this.#legal.combination
        );

        this.#shadow.appendChild(this.#degree_program_form_element);

        this.#disqualification_form_element = FormElement.new(
            this.#css_api
        );

        this.#disqualification_form_element.addTitle(
            "Disqualification"
        );

        const non_disqualified_element = this.#disqualification_form_element.addInput(
            "I am not disqualified from continuing my studies in the above-mentioned main subject because of exam failure or am not exams at another institution of higher education planned before the intended transfer, which would result in disqualification from the above-mentioned main subject in case of failure or non-attendance",
            "checkbox",
            "non-disqualified"
        );
        non_disqualified_element.required = true;

        this.#shadow.appendChild(this.#disqualification_form_element);

        this.#agb_form_element = FormElement.new(
            this.#css_api
        );

        this.#agb_form_element.addTitle(
            "AGB"
        );

        const agb_element = this.#agb_form_element.addInput(
            "I accept the terms and conditions of TODO",
            "checkbox",
            "agb"
        );
        agb_element.required = true;

        this.#shadow.appendChild(this.#agb_form_element);

        this.#complete_form_element = FormElement.new(
            this.#css_api
        );

        this.#complete_form_element.addTitle(
            "Complete"
        );

        const complete_element = this.#complete_form_element.addInput(
            "I confirm that all provided data is complete and truthful. The application is legally binding",
            "checkbox",
            "complete"
        );
        complete_element.required = true;

        this.#shadow.appendChild(this.#complete_form_element);

        this.#comments_form_element = FormElement.new(
            this.#css_api
        );

        this.#comments_form_element.addTitle(
            "Comments"
        );

        const comments_element = this.#comments_form_element.addInput(
            `Did any problems during the application proccess occur or would you like to share any comments or suggestions with us, so please use the comment box below (max ${this.#legal["max-comments-length"]} characters)`,
            "textarea",
            "comments",
            true
        );
        comments_element.maxLength = this.#legal["max-comments-length"];

        const comments_left_element = document.createElement("div");
        comments_element.parentElement.insertAdjacentElement("afterend", comments_left_element);

        comments_element.addEventListener("input", () => {
            comments_left_element.innerText = `Number of characters left: ${this.#legal["max-comments-length"] - comments_element.value.length}`;
        });

        this.#comments_form_element.addButtons(
            () => {
                this.#acceptedLegal();
            },
            this.#back_function
        );

        this.#shadow.appendChild(this.#comments_form_element);

        this.#shadow.appendChild(MandatoryElement.new(
            this.#css_api
        ));

        if (this.#legal.values !== null) {
            non_disqualified_element.checked = this.#legal.values["non-disqualified"];

            agb_element.checked = this.#legal.values.agb;

            complete_element.checked = this.#legal.values.complete;

            comments_element.value = this.#legal.values.comments;
        }

        comments_element.dispatchEvent(new Event("input"));
    }
}

export const LEGAL_ELEMENT_TAG_NAME = `${ELEMENT_TAG_NAME_PREFIX}${PAGE_LEGAL}`;

customElements.define(LEGAL_ELEMENT_TAG_NAME, LegalElement);
