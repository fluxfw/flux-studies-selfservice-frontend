import { FormInvalidElement } from "../FormInvalid/FormInvalidElement.mjs";
import { METHOD_POST } from "../../Libs/flux-fetch-api/src/Adapter/Method/METHOD.mjs";
import { STORAGE_SETTINGS_PREFIX } from "../Settings/STORAGE_SETTINGS_PREFIX.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "../../Libs/flux-color-scheme-api/src/Adapter/ColorScheme/COLOR_SCHEME.mjs";
import { PAGE_CHOICE_SUBJECT, PAGE_COMPLETED, PAGE_CREATE, PAGE_IDENTIFICATION_NUMBER, PAGE_INTENDED_DEGREE_PROGRAM, PAGE_INTENDED_DEGREE_PROGRAM_2, PAGE_LEGAL, PAGE_PERSONAL_DATA, PAGE_RESUME, PAGE_START, PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "../Page/PAGE.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("../ChoiceSubject/ChoiceSubjectElement.mjs").ChoiceSubjectElement} ChoiceSubjectElement */
/** @typedef {import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs").ColorSchemeApi} ColorSchemeApi */
/** @typedef {import("../Completed/CompletedElement.mjs").CompletedElement} CompletedElement */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs").FetchApi} FetchApi */
/** @typedef {import("../../Libs/flux-loading-api/src/Adapter/Loading/FullscreenLoadingElement.mjs").FullscreenLoadingElement} FullscreenLoadingElement */
/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../IdentificationNumber/IdentificationNumber.mjs").IdentificationNumber} IdentificationNumber */
/** @typedef {import("../IdentificationNumber/IdentificationNumberElement.mjs").IdentificationNumberElement} IdentificationNumberElement */
/** @typedef {import("../IntendedDegreeProgram/IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../IntendedDegreeProgram/IntendedDegreeProgramElement.mjs").IntendedDegreeProgramElement} IntendedDegreeProgramElement */
/** @typedef {import("../IntendedDegreeProgram2/IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("../IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs").IntendedDegreeProgram2Element} IntendedDegreeProgram2Element */
/** @typedef {import("../../Libs/flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../Service/Label/Port/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("../Legal/Legal.mjs").Legal} Legal */
/** @typedef {import("../Legal/LegalElement.mjs").LegalElement} LegalElement */
/** @typedef {import("../../Libs/flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../PersonalData/PersonalData.mjs").PersonalData} PersonalData */
/** @typedef {import("../PersonalData/PersonalDataElement.mjs").PersonalDataElement} PersonalDataElement */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/postFunction.mjs").postFunction} postFunction */
/** @typedef {import("../Post/PostClientResult.mjs").PostClientResult} PostClientResult */
/** @typedef {import("../../Libs/flux-pwa-api/src/Adapter/Api/PwaApi.mjs").PwaApi} PwaApi */
/** @typedef {import("../../Libs/flux-localization-api/src/Adapter/SelectLanguage/SelectLanguageButtonElement.mjs").SelectLanguageButtonElement} SelectLanguageButtonElement */
/** @typedef {import("../../Libs/flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../Start/Start.mjs").Start} Start */
/** @typedef {import("../Start/StartElement.mjs").StartElement} StartElement */
/** @typedef {import("../UniversityEntranceQualification/UniversityEntranceQualification.mjs").UniversityEntranceQualification} UniversityEntranceQualification */
/** @typedef {import("../UniversityEntranceQualification/UniversityEntranceQualificationElement.mjs").UniversityEntranceQualificationElement} UniversityEntranceQualificationElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class StudiesSelfserviceFrontendApi {
    /**
     * @type {ColorSchemeApi | null}
     */
    #color_scheme_api = null;
    /**
     * @type {CssApi | null}
     */
    #css_api = null;
    /**
     * @type {FetchApi | null}
     */
    #fetch_api = null;
    /**
     * @type {JsonApi | null}
     */
    #json_api = null;
    /**
     * @type {LabelService | null}
     */
    #label_service = null;
    /**
     * @type {LoadingApi | null}
     */
    #loading_api = null;
    /**
     * @type {LocalizationApi | null}
     */
    #localization_api = null;
    /**
     * @type {MainElement | null}
     */
    #main_element = null;
    /**
     * @type {PwaApi | null}
     */
    #pwa_api = null;
    /**
     * @type {SettingsApi | null}
     */
    #settings_api = null;

    /**
     * @returns {StudiesSelfserviceFrontendApi}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#fetch_api ??= await this.#getFetchApi();

        this.#css_api ??= await this.#getCssApi();

        this.#json_api ??= await this.#getJsonApi();

        this.#settings_api ??= await this.#getSettingsApi();

        this.#localization_api ??= await this.#getLocalizationApi();

        this.#color_scheme_api ??= await this.#getColorSchemeApi();

        this.#loading_api ??= await this.#getLoadingApi();

        this.#pwa_api ??= await this.#getPwaApi();

        this.#label_service ??= await this.#getLabelService();

        await this.#css_api.importCss(
            `${__dirname}/../style.css`
        );
        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../style.css`
        );

        this.#css_api.importCss(
            `${__dirname.substring(0, __dirname.lastIndexOf("/"))}/FormInvalid/FormInvalidElement.css`
        );

        this.#color_scheme_api.renderColorScheme();

        await this.#selectLanguage();
    }

    /**
     * @returns {Promise<void>}
     */
    async showFrontend() {
        document.body.appendChild(this.#main_element = (await import("../Main/MainElement.mjs")).MainElement.new(
            this.#color_scheme_api,
            this.#css_api,
            this
        ));

        await this.#next();
    }

    /**
     * @returns {SelectLanguageButtonElement}
     */
    getSelectLanguageButtonElement() {
        const select_language_parameters = this.#getSelectLanguageParameters();

        return this.#localization_api.getSelectLanguageButtonElement(
            select_language_parameters.localization_folder,
            select_language_parameters.module,
            select_language_parameters.ensure,
            () => {
                this.#afterSelectLanguage();
            }
        );
    }

    /**
     * @returns {void}
     */
    #afterSelectLanguage() {
        this.#main_element.remove();
        this.#main_element = null;

        this.showFrontend();
    }

    /**
     * @returns {Promise<PostClientResult>}
     */
    async #back() {
        try {
            await this.#fetch_api.fetch({
                url: "/api/back",
                method: METHOD_POST
            });

            return {
                ok: true
            };
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                ...error instanceof Response ? {
                    "server-error": true
                } : {
                    "network-error": true
                }
            };
        }
    }

    /**
     * @returns {Promise<GetResult | PostClientResult>}
     */
    async #get() {
        try {
            return await this.#fetch_api.fetch({
                url: "/api/get"
            });
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                ...error instanceof Response ? {
                    "server-error": true
                } : {
                    "network-error": true
                }
            };
        }
    }

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<ChoiceSubjectElement>}
     */
    async #getChoiceSubjectElement(choice_subject, post_function, back_function = null) {
        return (await import("../ChoiceSubject/ChoiceSubjectElement.mjs")).ChoiceSubjectElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            choice_subject,
            async chosen_subject => post_function(
                {
                    page: PAGE_CHOICE_SUBJECT,
                    data: chosen_subject
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<ColorSchemeApi>}
     */
    async #getColorSchemeApi() {
        const color_scheme_api = (await import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs")).ColorSchemeApi.new(
            [
                {
                    color_scheme: COLOR_SCHEME_LIGHT,
                    name: "light"
                },
                {
                    color_scheme: COLOR_SCHEME_DARK,
                    name: "dark"
                }
            ],
            this.#css_api,
            this.#localization_api,
            this.#settings_api,
            {
                [COLOR_SCHEME_LIGHT]: "light",
                [COLOR_SCHEME_DARK]: "dark"
            },
            [
                "form-background-color",
                "form-buttons-background-color"
            ]
        );

        await color_scheme_api.init();

        return color_scheme_api;
    }

    /**
     * @param {backFunction | null} back_function
     * @returns {Promise<CompletedElement>}
     */
    async #getCompletedElement(back_function = null) {
        return (await import("../Completed/CompletedElement.mjs")).CompletedElement.new(
            this.#css_api,
            this.#localization_api,
            back_function
        );
    }

    /**
     * @returns {Promise<CssApi>}
     */
    async #getCssApi() {
        const css_api = (await import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs")).CssApi.new(
            this.#fetch_api
        );

        await css_api.init();

        return css_api;
    }

    /**
     * @returns {Promise<FetchApi>}
     */
    async #getFetchApi() {
        const fetch_api = (await import("../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs")).FetchApi.new();

        await fetch_api.init();

        return fetch_api;
    }

    /**
     * @param {string} message
     * @returns {FormInvalidElement}
     */
    #getFormInvalidElement(message) {
        return FormInvalidElement.new(
            this.#css_api,
            message
        );
    }

    /**
     * @param {IdentificationNumber} identification_number
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<IdentificationNumberElement>}
     */
    async #getIdentificationNumberElement(identification_number, post_function, back_function = null) {
        return (await import("../IdentificationNumber/IdentificationNumberElement.mjs")).IdentificationNumberElement.new(
            this.#css_api,
            this.#localization_api,
            identification_number,
            async confirmed_identification_number => post_function(
                {
                    page: PAGE_IDENTIFICATION_NUMBER,
                    data: confirmed_identification_number
                }
            ),
            back_function
        );
    }

    /**
     * @param {IntendedDegreeProgram} intended_degree_program
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<IntendedDegreeProgramElement>}
     */
    async #getIntendedDegreeProgramElement(intended_degree_program, post_function, back_function = null) {
        return (await import("../IntendedDegreeProgram/IntendedDegreeProgramElement.mjs")).IntendedDegreeProgramElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            intended_degree_program,
            async chosen_intended_degree_program => post_function(
                {
                    page: PAGE_INTENDED_DEGREE_PROGRAM,
                    data: chosen_intended_degree_program
                }
            ),
            back_function
        );
    }

    /**
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<IntendedDegreeProgram2Element>}
     */
    async #getIntendedDegreeProgram2Element(intended_degree_program_2, post_function, back_function = null) {
        return (await import("../IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs")).IntendedDegreeProgram2Element.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            intended_degree_program_2,
            async chosen_intended_degree_program_2 => post_function(
                {
                    page: PAGE_INTENDED_DEGREE_PROGRAM_2,
                    data: chosen_intended_degree_program_2
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<JsonApi>}
     */
    async #getJsonApi() {
        const json_api = (await import("../../Libs/flux-json-api/src/Adapter/Api/JsonApi.mjs")).JsonApi.new(
            this.#fetch_api
        );

        await json_api.init();

        return json_api;
    }

    /**
     * @returns {Promise<LabelService>}
     */
    async #getLabelService() {
        return (await import("../../Service/Label/Port/LabelService.mjs")).LabelService.new(
            this.#localization_api
        );
    }

    /**
     * @param {Legal} legal
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<LegalElement>}
     */
    async #getLegalElement(legal, post_function, back_function = null) {
        return (await import("../Legal/LegalElement.mjs")).LegalElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            legal,
            async accepted_legal => post_function(
                {
                    page: PAGE_LEGAL,
                    data: accepted_legal
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<LoadingApi>}
     */
    async #getLoadingApi() {
        const loading_api = (await import("../../Libs/flux-loading-api/src/Adapter/Api/LoadingApi.mjs")).LoadingApi.new(
            this.#css_api
        );

        await loading_api.init();

        return loading_api;
    }

    /**
     * @returns {FullscreenLoadingElement}
     */
    #getLoadingElement() {
        const loading_element = this.#loading_api.getFullscreenLoadingElement();
        document.body.appendChild(loading_element);
        return loading_element;
    }

    /**
     * @returns {Promise<LocalizationApi>}
     */
    async #getLocalizationApi() {
        const localization_api = (await import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs")).LocalizationApi.new(
            this.#css_api,
            this.#json_api,
            this.#settings_api
        );

        await localization_api.init();

        return localization_api;
    }

    /**
     * @param {GetResult} get_result
     * @param {postFunction} post_function
     * @param {backFunction} back_function
     * @returns {Promise<HTMLElement>}
     */
    async #getPage(get_result, post_function, back_function) {
        try {
            const _back_function = get_result["can-back"] ? back_function : null;

            switch (get_result.page) {
                case PAGE_CHOICE_SUBJECT:
                    return await this.#getChoiceSubjectElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_COMPLETED:
                    return await this.#getCompletedElement(
                        _back_function
                    );

                case PAGE_CREATE:
                case PAGE_RESUME:
                case PAGE_START:
                    return await this.#getStartElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_IDENTIFICATION_NUMBER:
                    return await this.#getIdentificationNumberElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_INTENDED_DEGREE_PROGRAM:
                    return await this.#getIntendedDegreeProgramElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_INTENDED_DEGREE_PROGRAM_2:
                    return await this.#getIntendedDegreeProgram2Element(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_LEGAL:
                    return await this.#getLegalElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_PERSONAL_DATA:
                    return await this.#getPersonalDataElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION:
                    return await this.#getUniversityEntranceQualificationElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                default:
                    return this.#getFormInvalidElement(
                        `Unsupported page ${get_result.page}`
                    );
            }
        } catch (error) {
            console.error(error);

            return this.#getFormInvalidElement(
                this.#localization_api.translate(
                    "Page error!"
                )
            );
        }
    }

    /**
     * @param {PersonalData} personal_data
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<IntendedDegreeProgramElement>}
     */
    async #getPersonalDataElement(personal_data, post_function, back_function = null) {
        return (await import("../PersonalData/PersonalDataElement.mjs")).PersonalDataElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            personal_data,
            async filled_personal_data => post_function(
                {
                    page: PAGE_PERSONAL_DATA,
                    data: filled_personal_data
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<PwaApi>}
     */
    async #getPwaApi() {
        const pwa_api = (await import("../../Libs/flux-pwa-api/src/Adapter/Api/PwaApi.mjs")).PwaApi.new(
            this.#css_api,
            this.#json_api,
            `${__dirname}/../Pwa/manifest.json`,
            () => this.#color_scheme_api.getBackground(),
            () => this.#localization_api.getDirection(),
            () => this.#localization_api.getLanguage(),
            () => this.#color_scheme_api.getAccent(),
            text => this.#localization_api.translate(
                text
            )
        );

        await pwa_api.init();

        return pwa_api;
    }

    /**
     * @returns {{localization_folder: string, module: string | null, ensure: () => Promise<void> | null}}
     */
    #getSelectLanguageParameters() {
        return {
            localization_folder: `${__dirname}/../Localization`,
            module: null,
            ensure: async () => {
                this.#pwa_api.initPwa();
            }
        };
    }

    /**
     * @returns {Promise<SettingsApi>}
     */
    async #getSettingsApi() {
        const settings_api = await (await import("../../Libs/flux-settings-api/src/Adapter/Api/SettingsApi.mjs")).SettingsApi.newWithAutoSettings(
            STORAGE_SETTINGS_PREFIX
        );

        await settings_api.init();

        return settings_api;
    }

    /**
     * @param {Start} start
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<StartElement>}
     */
    async #getStartElement(start, post_function, back_function = null) {
        return (await import("../Start/StartElement.mjs")).StartElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            start,
            async create => post_function(
                {
                    page: PAGE_CREATE,
                    data: create
                }
            ),
            async resume => post_function(
                {
                    page: PAGE_RESUME,
                    data: resume
                }
            ),
            back_function
        );
    }

    /**
     * @param {UniversityEntranceQualification} university_entrance_qualification
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<IntendedDegreeProgramElement>}
     */
    async #getUniversityEntranceQualificationElement(university_entrance_qualification, post_function, back_function = null) {
        return (await import("../UniversityEntranceQualification/UniversityEntranceQualificationElement.mjs")).UniversityEntranceQualificationElement.new(
            this.#css_api,
            this.#label_service,
            this.#localization_api,
            university_entrance_qualification,
            async chosen_university_entrance_qualification => post_function(
                {
                    page: PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION,
                    data: chosen_university_entrance_qualification
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #next() {
        scroll(0, 0);

        const get_loading_element = this.#getLoadingElement();

        const get_result = await this.#get();

        get_loading_element.remove();

        let page;
        if (!("ok" in get_result)) {
            page = await this.#getPage(
                get_result,
                async post => {
                    const post_loading_element = this.#getLoadingElement();

                    const post_result = await this.#post(
                        post
                    );

                    post_loading_element.remove();

                    if (!post_result.ok) {
                        return post_result;
                    }

                    this.#next();

                    return post_result;
                },
                async () => {
                    const back_loading_element = this.#getLoadingElement();

                    const back_result = await this.#back();

                    back_loading_element.remove();

                    if (!back_result.ok) {
                        this.#main_element.replaceContent(
                            this.#getFormInvalidElement(
                                this.#localization_api.translate(
                                    back_result["network-error"] ? "Network error!" : back_result["server-error"] ? "Server error!" : ""
                                )
                            )
                        );
                        return;
                    }

                    this.#next();
                }
            );
        } else {
            page = this.#getFormInvalidElement(
                this.#localization_api.translate(
                    get_result["network-error"] ? "Network error!" : get_result["server-error"] ? "Server error!" : ""
                )
            );
        }

        this.#main_element.replaceContent(
            page
        );
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostClientResult>}
     */
    async #post(post) {
        try {
            return await this.#fetch_api.fetch({
                url: "/api/post",
                method: METHOD_POST,
                data: post
            });
        } catch (error) {
            console.error(error);

            return {
                ok: false,
                ...error instanceof Response ? {
                    "server-error": true
                } : {
                    "network-error": true
                }
            };
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #selectLanguage() {
        const select_language_parameters = this.#getSelectLanguageParameters();

        await this.#localization_api.selectLanguage(
            select_language_parameters.localization_folder,
            select_language_parameters.module,
            select_language_parameters.ensure
        );
    }
}
