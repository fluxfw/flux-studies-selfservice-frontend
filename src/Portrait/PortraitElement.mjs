import { flux_import_css } from "../Libs/flux-style-sheet-manager/src/FluxImportCss.mjs";
import { FormElement } from "../Form/FormElement.mjs";
import { LOCALIZATION_MODULE } from "../Localization/LOCALIZATION_MODULE.mjs";
import { MandatoryElement } from "../Mandatory/MandatoryElement.mjs";
import { PAGE_PORTRAIT } from "../Page/PAGE.mjs";
import { PhotoElement } from "../Photo/PhotoElement.mjs";
import { TitleElement } from "../Title/TitleElement.mjs";
import { LOCALIZATION_KEY_PHOTO, LOCALIZATION_KEY_PHOTO_CRITERIA, LOCALIZATION_KEY_PLEASE_CHECK_YOUR_DATA, LOCALIZATION_KEY_PORTRAIT, LOCALIZATION_KEY_THE_PHOTO_COULD_NOT_BEEN_LOADED, LOCALIZATION_KEY_THE_PHOTO_COULD_NOT_BEEN_OPTIMIZED, LOCALIZATION_KEY_THE_PHOTO_HAS_A_WRONG_ASPECT_RATIO_NEEDED_NEEDED_ASPECT_RATIO_CURRENT_CURRENT_ASPECT_RATIO, LOCALIZATION_KEY_THE_PHOTO_IS_TOO_BIG_MAXIMAL_MAX_DATA_SIZE_CURRENT_CURRENT_DATA_SIZE, LOCALIZATION_KEY_THE_PHOTO_IS_TOO_BIG_MAXIMAL_MAX_SIZE, LOCALIZATION_KEY_THE_PHOTO_IS_TOO_SMALL_MINIMAL_MIN_SIZE } from "../Localization/LOCALIZATION_KEY.mjs";

/** @typedef {import("../Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./chosenPortraitFunction.mjs").chosenPortraitFunction} chosenPortraitFunction */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../Libs/flux-style-sheet-manager/src/FluxStyleSheetManager.mjs").FluxStyleSheetManager} FluxStyleSheetManager */
/** @typedef {import("../Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../Photo/Photo.mjs").Photo} Photo */
/** @typedef {import("../Photo/PhotoService.mjs").PhotoService} PhotoService */
/** @typedef {import("./Portrait.mjs").Portrait} Portrait */

const css = await flux_import_css.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PortraitElement.css`
);

export class PortraitElement extends HTMLElement {
    /**
     * @type {backFunction | null}
     */
    #back_function;
    /**
     * @type {chosenPortraitFunction}
     */
    #chosen_portrait_function;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FluxStyleSheetManager}
     */
    #flux_style_sheet_manager;
    /**
     * @type {FormElement}
     */
    #form_element;
    /**
     * @type {LabelService}
     */
    #label_service;
    /**
     * @type {Photo | null}
     */
    #photo = null;
    /**
     * @type {PhotoElement}
     */
    #photo_element;
    /**
     * @type {PhotoService}
     */
    #photo_service;
    /**
     * @type {Portrait}
     */
    #portrait;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxStyleSheetManager} flux_style_sheet_manager
     * @param {LabelService} label_service
     * @param {PhotoService} photo_service
     * @param {Portrait} portrait
     * @param {chosenPortraitFunction} chosen_portrait
     * @param {backFunction | null} back_function
     * @returns {PortraitElement}
     */
    static new(flux_localization_api, flux_style_sheet_manager, label_service, photo_service, portrait, chosen_portrait, back_function = null) {
        return new this(
            flux_localization_api,
            flux_style_sheet_manager,
            label_service,
            photo_service,
            portrait,
            chosen_portrait,
            back_function
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxStyleSheetManager} flux_style_sheet_manager
     * @param {LabelService} label_service
     * @param {PhotoService} photo_service
     * @param {Portrait} portrait
     * @param {chosenPortraitFunction} chosen_portrait
     * @param {backFunction | null} back_function
     * @private
     */
    constructor(flux_localization_api, flux_style_sheet_manager, label_service, photo_service, portrait, chosen_portrait, back_function) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#flux_style_sheet_manager = flux_style_sheet_manager;
        this.#label_service = label_service;
        this.#photo_service = photo_service;
        this.#portrait = portrait;
        this.#chosen_portrait_function = chosen_portrait;
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
    async #chosenPortrait() {
        if (!await this.#form_element.validate()) {
            return;
        }

        await this.#setPhoto(
            true
        );

        if (this.#photo !== null) {
            if (this.#photo.length > this.#portrait["photo-max-data-size"]) {
                this.#form_element.setCustomValidationMessage(
                    this.#form_element.inputs.photo,
                    await this.#flux_localization_api.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_THE_PHOTO_IS_TOO_BIG_MAXIMAL_MAX_DATA_SIZE_CURRENT_CURRENT_DATA_SIZE,
                        {
                            "max-data-size": `${this.#portrait["photo-max-data-size"]}bytes`,
                            "current-data-size": `${this.#photo.length}bytes`
                        }
                    )
                );
                return;
            }
        }

        const post_result = await this.#chosen_portrait_function(
            {
                photo: this.#photo
            }
        );

        if (post_result.ok) {
            return;
        }

        if (post_result["error-messages"] !== null) {
            for (const error_message of post_result["error-messages"]) {
                this.#form_element.addInvalidMessage(
                    await this.#label_service.getErrorMessageLabel(
                        error_message
                    )
                );
            }
        } else {
            this.#form_element.addInvalidMessage(
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
    async #removePhoto() {
        this.#photo = null;
        this.#form_element.inputs.photo.value = "";
        await this.#photo_element.setImage();
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        this.#shadow.append(TitleElement.new(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PORTRAIT
            )
        ));

        this.#form_element = FormElement.new(
            this.#flux_localization_api,
            async () => {
                const size = await this.#photo_element.getSize();
                if (size !== null) {
                    if (size.width < this.#portrait["photo-min-width"] || size.height < this.#portrait["photo-min-height"]) {
                        this.#form_element.setCustomValidationMessage(
                            this.#form_element.inputs.photo,
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_THE_PHOTO_IS_TOO_SMALL_MINIMAL_MIN_SIZE,
                                {
                                    "min-size": `${this.#portrait["photo-min-width"]}px x ${this.#portrait["photo-min-height"]}px`
                                }
                            )
                        );
                        return false;
                    }

                    if (size.width > this.#portrait["photo-max-width"] || size.height > this.#portrait["photo-max-height"]) {
                        this.#form_element.setCustomValidationMessage(
                            this.#form_element.inputs.photo,
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_THE_PHOTO_IS_TOO_BIG_MAXIMAL_MAX_SIZE,
                                {
                                    "max-size": `${this.#portrait["photo-max-width"]}px x ${this.#portrait["photo-max-height"]}px`
                                }
                            )
                        );
                        return false;
                    }

                    const aspect_ratio = size.width / size.height;
                    if (aspect_ratio < this.#portrait["photo-min-aspect-ratio"] || aspect_ratio > this.#portrait["photo-max-aspect-ratio"]) {
                        this.#form_element.setCustomValidationMessage(
                            this.#form_element.inputs.photo,
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                LOCALIZATION_KEY_THE_PHOTO_HAS_A_WRONG_ASPECT_RATIO_NEEDED_NEEDED_ASPECT_RATIO_CURRENT_CURRENT_ASPECT_RATIO,
                                {
                                    "needed-aspect-ratio": `${this.#portrait["photo-min-aspect-ratio"]} - ${this.#portrait["photo-max-aspect-ratio"]}`,
                                    "current-aspect-ratio": aspect_ratio
                                }
                            )
                        );
                        return false;
                    }
                }

                return true;
            }
        );

        this.#form_element.addTitle(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PORTRAIT
            )
        );

        const input_element = this.#form_element.addInput(
            await this.#flux_localization_api.translate(
                LOCALIZATION_MODULE,
                LOCALIZATION_KEY_PHOTO
            ),
            "file",
            "photo",
            false,
            true
        );
        input_element.accept = "image/*";
        input_element.addEventListener("input", () => {
            this.#setPhoto();
        });
        input_element.required = this.#portrait["required-photo"];

        input_element.parentElement.parentElement.parentElement.append(this.#photo_element = PhotoElement.new(
            this.#flux_localization_api,
            this.#photo_service
        ));

        const criteria_element = this.#form_element.addSubtitle(
            ""
        );
        const criteria_link_element = document.createElement("a");
        const link = await this.#label_service.getPhotoCriteriaLink(
            this.#portrait
        );
        if (link !== "") {
            criteria_link_element.href = link;
        }
        criteria_link_element.innerText = await this.#flux_localization_api.translate(
            LOCALIZATION_MODULE,
            LOCALIZATION_KEY_PHOTO_CRITERIA
        );
        criteria_link_element.rel = "noopener noreferrer";
        criteria_link_element.target = "__blank";
        criteria_element.addElement(criteria_link_element);

        await this.#form_element.addButtons(
            () => {
                this.#chosenPortrait();
            },
            this.#back_function
        );

        this.#shadow.append(this.#form_element);

        this.#shadow.append(MandatoryElement.new(
            this.#flux_localization_api
        ));

        if (this.#portrait.values !== null) {
            if (this.#portrait.values.photo !== null) {
                await this.#photo_service.toInputElement(
                    this.#portrait.values.photo,
                    input_element,
                    this.#portrait["photo-type"]
                );
                input_element.dispatchEvent(new Event("input"));
            }
        }
    }

    /**
     * @param {boolean} final
     * @returns {Promise<void>}
     */
    async #setPhoto(final = false) {
        const flux_overlay_element = await (await import("../Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading(
            this.#flux_style_sheet_manager
        );

        try {
            const photo = await this.#photo_service.fromInputElement(
                this.#form_element.inputs.photo
            );

            if (photo === null) {
                if (!final) {
                    await this.#removePhoto();
                }
                return;
            }

            this.#photo = await this.#photo_service.optimize(
                photo.photo,
                photo.type,
                this.#portrait["photo-type"],
                this.#portrait["photo-quality"],
                !final ? this.#portrait["photo-preview-max-width"] : this.#portrait["photo-max-width"],
                !final ? this.#portrait["photo-preview-max-height"] : this.#portrait["photo-max-height"],
                this.#portrait["photo-grayscale"],
                !final ? null : await this.#photo_element.getCrop()
            );

            if (final) {
                return;
            }

            await this.#photo_element.setImage(
                await this.#photo_service.toImageElement(
                    this.#photo,
                    this.#portrait["photo-type"]
                )
            );

            await this.#photo_service.toInputElement(
                this.#photo,
                this.#form_element.inputs.photo,
                this.#portrait["photo-type"]
            );
        } catch (error) {
            if (final) {
                this.#form_element.setCustomValidationMessage(
                    this.#form_element.inputs.photo,
                    await this.#flux_localization_api.translate(
                        LOCALIZATION_MODULE,
                        LOCALIZATION_KEY_THE_PHOTO_COULD_NOT_BEEN_OPTIMIZED
                    )
                );

                return Promise.reject(error);
            }

            console.error(error);

            await this.#removePhoto();
            this.#form_element.inputs.photo.dispatchEvent(new Event("input"));

            this.#form_element.setCustomValidationMessage(
                this.#form_element.inputs.photo,
                await this.#flux_localization_api.translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_THE_PHOTO_COULD_NOT_BEEN_LOADED
                )
            );
        } finally {
            flux_overlay_element.remove();
        }
    }
}

export const PORTRAIT_ELEMENT_TAG_NAME = `flux-studis-selfservice-${PAGE_PORTRAIT}`;

customElements.define(PORTRAIT_ELEMENT_TAG_NAME, PortraitElement);
