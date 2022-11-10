import { METHOD_POST } from "../../Libs/flux-fetch-api/src/Adapter/Method/METHOD.mjs";
import { STORAGE_SETTINGS_PREFIX } from "../Settings/STORAGE_SETTINGS_PREFIX.mjs";
import { COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT } from "../../Libs/flux-color-scheme-api/src/Adapter/ColorScheme/COLOR_SCHEME.mjs";
import { PAGE_CHOICE_SUBJECT, PAGE_COMPLETED, PAGE_CREATE, PAGE_IDENTIFICATION_NUMBER, PAGE_INTENDED_DEGREE_PROGRAM, PAGE_INTENDED_DEGREE_PROGRAM_2, PAGE_LEGAL, PAGE_PERSONAL_DATA, PAGE_PORTRAIT, PAGE_PREVIOUS_STUDIES, PAGE_RESUME, PAGE_START, PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "../Page/PAGE.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("../ChoiceSubject/ChoiceSubjectElement.mjs").ChoiceSubjectElement} ChoiceSubjectElement */
/** @typedef {import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs").ColorSchemeApi} ColorSchemeApi */
/** @typedef {import("../Completed/CompletedElement.mjs").CompletedElement} CompletedElement */
/** @typedef {import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs").FetchApi} FetchApi */
/** @typedef {import("../FormInvalid/FormInvalidElement.mjs").FormInvalidElement} FormInvalidElement */
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
/** @typedef {import("../Main/MainElement.mjs").MainElement} MainElement */
/** @typedef {import("../PersonalData/PersonalData.mjs").PersonalData} PersonalData */
/** @typedef {import("../PersonalData/PersonalDataElement.mjs").PersonalDataElement} PersonalDataElement */
/** @typedef {import("../../Service/Photo/Port/PhotoService.mjs").PhotoService} PhotoService */
/** @typedef {import("../Portrait/Portrait.mjs").Portrait} Portrait */
/** @typedef {import("../Portrait/PortraitElement.mjs").PortraitElement} PortraitElement */
/** @typedef {import("../PreviousStudies/PreviousStudies.mjs").PreviousStudies} PreviousStudies */
/** @typedef {import("../PreviousStudies/PreviousStudiesElement.mjs").PreviousStudiesElement} PreviousStudiesElement */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/postFunction.mjs").postFunction} postFunction */
/** @typedef {import("../Post/PostResult.mjs").PostResult} PostResult */
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
     * @type {PhotoService | null}
     */
    #photo_service = null;
    /**
     * @type {GetResult | null}
     */
    #previous_get_result = null;
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
        const color_scheme_api = await this.#getColorSchemeApi();
        const css_api = await this.#getCssApi();
        await this.#getLoadingApi();
        await this.#getLocalizationApi();
        await this.#getPwaApi();

        await css_api.importCss(
            `${__dirname.substring(0, __dirname.lastIndexOf("/"))}/FormInvalid/FormInvalidElement.css`
        );
        await import("../FormInvalid/FormInvalidElement.mjs");

        await css_api.importCss(
            `${__dirname}/../style.css`
        );
        css_api.importCssToRoot(
            document,
            `${__dirname}/../style.css`
        );

        await this.#localization_api.addModule(
            `${__dirname}/../Localization`
        );

        await color_scheme_api.renderColorScheme();

        await this.#selectLanguage();
    }

    /**
     * @param {boolean} previous_get_result
     * @returns {Promise<void>}
     */
    async showFrontend(previous_get_result = false) {
        document.body.appendChild(this.#main_element = (await import("../Main/MainElement.mjs")).MainElement.new(
            await this.#getColorSchemeApi(),
            await this.#getCssApi(),
            await this.#getLocalizationApi(),
            this
        ));

        await this.#next(
            previous_get_result
        );
    }

    /**
     * @returns {Promise<SelectLanguageButtonElement>}
     */
    async getSelectLanguageButtonElement() {
        return (await this.#getLocalizationApi()).getSelectLanguageButtonElement(
            async () => {
                await this.#ensureBeforeAndAfterSelectLanguage();
            },
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

        this.showFrontend(
            true
        );
    }

    /**
     * @returns {Promise<PostResult>}
     */
    async #back() {
        try {
            await (await this.#getFetchApi()).fetch({
                url: `${__dirname}/../../api/back`,
                method: METHOD_POST
            });

            return {
                ok: true
            };
        } catch (error) {
            console.error(error);

            const languages = await this.#localization_api.getLanguages();

            return {
                ok: false,
                "error-messages": [
                    Object.fromEntries(await Promise.all(Object.entries({
                        ...languages.preferred,
                        ...languages.other
                    }).map(async ([
                        language
                    ]) => this.#localization_api.translate(
                        error instanceof Response ? "Server error!" : "Network error!",
                        null,
                        null,
                        language
                    ))))
                ]
            };
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #ensureBeforeAndAfterSelectLanguage() {
        await (await this.#getPwaApi()).initPwa(
            `${__dirname}/../Pwa/manifest.json`
        );
    }

    /**
     * @returns {Promise<GetResult | PostResult>}
     */
    async #get() {
        try {
            return await (await this.#getFetchApi()).fetch({
                url: `${__dirname}/../../api/get`
            });
        } catch (error) {
            console.error(error);

            const languages = await this.#localization_api.getLanguages();

            return {
                ok: false,
                "error-messages": [
                    Object.fromEntries(await Promise.all(Object.entries({
                        ...languages.preferred,
                        ...languages.other
                    }).map(async ([
                        language
                    ]) => this.#localization_api.translate(
                        error instanceof Response ? "Server error!" : "Network error!",
                        null,
                        null,
                        language
                    ))))
                ]
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
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
        if (this.#color_scheme_api === null) {
            this.#color_scheme_api ??= (await import("../../Libs/flux-color-scheme-api/src/Adapter/Api/ColorSchemeApi.mjs")).ColorSchemeApi.new(
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
                await this.#getCssApi(),
                await this.#getLocalizationApi(),
                await this.#getSettingsApi(),
                {
                    [COLOR_SCHEME_LIGHT]: "light",
                    [COLOR_SCHEME_DARK]: "dark"
                },
                [
                    "container-border-color",
                    "form-background-color",
                    "form-buttons-background-color",
                    "input-border-color",
                    "left-background-color",
                    "left-border-color"
                ]
            );

            await this.#color_scheme_api.init();
        }

        return this.#color_scheme_api;
    }

    /**
     * @param {backFunction | null} back_function
     * @returns {Promise<CompletedElement>}
     */
    async #getCompletedElement(back_function = null) {
        return (await import("../Completed/CompletedElement.mjs")).CompletedElement.new(
            await this.#getCssApi(),
            await this.#getLocalizationApi(),
            back_function
        );
    }

    /**
     * @returns {Promise<CssApi>}
     */
    async #getCssApi() {
        if (this.#css_api === null) {
            this.#css_api ??= (await import("../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs")).CssApi.new(
                await this.#getFetchApi()
            );

            await this.#css_api.init();
        }

        return this.#css_api;
    }

    /**
     * @returns {Promise<FetchApi>}
     */
    async #getFetchApi() {
        if (this.#fetch_api === null) {
            this.#fetch_api ??= (await import("../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs")).FetchApi.new();

            await this.#fetch_api.init();
        }

        return this.#fetch_api;
    }

    /**
     * @param {string} message
     * @returns {Promise<FormInvalidElement>}
     */
    async #getFormInvalidElement(message) {
        return (await import("../FormInvalid/FormInvalidElement.mjs")).FormInvalidElement.new(
            await this.#getCssApi(),
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
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
        if (this.#json_api === null) {
            this.#json_api ??= (await import("../../Libs/flux-json-api/src/Adapter/Api/JsonApi.mjs")).JsonApi.new(
                await this.#getFetchApi()
            );

            await this.#json_api.init();
        }

        return this.#json_api;
    }

    /**
     * @returns {Promise<LabelService>}
     */
    async #getLabelService() {
        this.#label_service ??= (await import("../../Service/Label/Port/LabelService.mjs")).LabelService.new(
            await this.#getLocalizationApi()
        );

        return this.#label_service;
    }

    /**
     * @param {Legal} legal
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<LegalElement>}
     */
    async #getLegalElement(legal, post_function, back_function = null) {
        return (await import("../Legal/LegalElement.mjs")).LegalElement.new(
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
        if (this.#loading_api === null) {
            this.#loading_api ??= (await import("../../Libs/flux-loading-api/src/Adapter/Api/LoadingApi.mjs")).LoadingApi.new(
                await this.#getCssApi()
            );

            await this.#loading_api.init();
        }

        return this.#loading_api;
    }

    /**
     * @returns {Promise<FullscreenLoadingElement>}
     */
    async #getLoadingElement() {
        const loading_element = await (await this.#getLoadingApi()).getFullscreenLoadingElement();
        document.body.appendChild(loading_element);
        return loading_element;
    }

    /**
     * @returns {Promise<LocalizationApi>}
     */
    async #getLocalizationApi() {
        if (this.#localization_api === null) {
            this.#localization_api ??= (await import("../../Libs/flux-localization-api/src/Adapter/Api/LocalizationApi.mjs")).LocalizationApi.new(
                await this.#getJsonApi(),
                await this.#getCssApi(),
                await this.#getSettingsApi()
            );

            await this.#localization_api.init();
        }

        return this.#localization_api;
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

                case PAGE_PORTRAIT:
                    return await this.#getPortraitElement(
                        get_result.data,
                        post_function,
                        _back_function
                    );

                case PAGE_PREVIOUS_STUDIES:
                    return await this.#getPreviousStudiesElement(
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
                await (await this.#getLocalizationApi()).translate(
                    "Page error!"
                )
            );
        }
    }

    /**
     * @param {PersonalData} personal_data
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<PersonalDataElement>}
     */
    async #getPersonalDataElement(personal_data, post_function, back_function = null) {
        return (await import("../PersonalData/PersonalDataElement.mjs")).PersonalDataElement.new(
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
     * @returns {Promise<PhotoService>}
     */
    async #getPhotoService() {
        this.#photo_service ??= (await import("../../Service/Photo/Port/PhotoService.mjs")).PhotoService.new(
            await this.#getLocalizationApi()
        );

        return this.#photo_service;
    }

    /**
     * @param {Portrait} portrait
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<PortraitElement>}
     */
    async #getPortraitElement(portrait, post_function, back_function = null) {
        return (await import("../Portrait/PortraitElement.mjs")).PortraitElement.new(
            await this.#getCssApi(),
            async () => this.#getLoadingElement(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
            await this.#getPhotoService(),
            portrait,
            async chosen_portrait => post_function(
                {
                    page: PAGE_PORTRAIT,
                    data: chosen_portrait
                }
            ),
            back_function
        );
    }

    /**
     * @param {PreviousStudies} previous_studies
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<PreviousStudiesElement>}
     */
    async #getPreviousStudiesElement(previous_studies, post_function, back_function = null) {
        return (await import("../PreviousStudies/PreviousStudiesElement.mjs")).PreviousStudiesElement.new(
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
            previous_studies,
            async chosen_previous_studies => post_function(
                {
                    page: PAGE_PREVIOUS_STUDIES,
                    data: chosen_previous_studies
                }
            ),
            back_function
        );
    }

    /**
     * @returns {Promise<PwaApi>}
     */
    async #getPwaApi() {
        if (this.#pwa_api === null) {
            this.#pwa_api ??= (await import("../../Libs/flux-pwa-api/src/Adapter/Api/PwaApi.mjs")).PwaApi.new(
                await this.#getCssApi(),
                await this.#getJsonApi(),
                await this.#getLocalizationApi()
            );

            await this.#pwa_api.init();
        }

        return this.#pwa_api;
    }

    /**
     * @returns {Promise<SettingsApi>}
     */
    async #getSettingsApi() {
        if (this.#settings_api === null) {
            this.#settings_api ??= await (await import("../../Libs/flux-settings-api/src/Adapter/Api/SettingsApi.mjs")).SettingsApi.newWithAutoSettings(
                STORAGE_SETTINGS_PREFIX
            );

            await this.#settings_api.init();
        }

        return this.#settings_api;
    }

    /**
     * @param {Start} start
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<StartElement>}
     */
    async #getStartElement(start, post_function, back_function = null) {
        return (await import("../Start/StartElement.mjs")).StartElement.new(
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
     * @returns {Promise<UniversityEntranceQualificationElement>}
     */
    async #getUniversityEntranceQualificationElement(university_entrance_qualification, post_function, back_function = null) {
        return (await import("../UniversityEntranceQualification/UniversityEntranceQualificationElement.mjs")).UniversityEntranceQualificationElement.new(
            await this.#getCssApi(),
            await this.#getLabelService(),
            await this.#getLocalizationApi(),
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
     * @param {boolean} previous_get_result
     * @returns {Promise<void>}
     */
    async #next(previous_get_result = false) {
        scroll(0, 0);

        const get_loading_element = await this.#getLoadingElement();

        if (!previous_get_result || this.#previous_get_result === null) {
            this.#previous_get_result = await this.#get();
        }

        get_loading_element.remove();

        let page;
        if (!("ok" in this.#previous_get_result)) {
            page = await this.#getPage(
                this.#previous_get_result,
                async post => {
                    const post_loading_element = await this.#getLoadingElement();

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
                    const back_loading_element = await this.#getLoadingElement();

                    const back_result = await this.#back();

                    back_loading_element.remove();

                    if (!back_result.ok) {
                        this.#main_element.replaceContent(
                            await this.#getFormInvalidElement(
                                await (await this.#getLabelService()).getErrorMessageLabel(
                                    back_result["error-messages"]?.[0] ?? {}
                                )
                            )
                        );
                        return;
                    }

                    this.#next();
                }
            );
        } else {
            page = await this.#getFormInvalidElement(
                await (await this.#getLabelService()).getErrorMessageLabel(
                    this.#previous_get_result["error-messages"]?.[0] ?? {}
                )
            );
        }

        this.#main_element.replaceContent(
            page
        );
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async #post(post) {
        try {
            return await (await this.#getFetchApi()).fetch({
                url: `${__dirname}/../../api/post`,
                method: METHOD_POST,
                data: post
            });
        } catch (error) {
            console.error(error);

            const languages = await this.#localization_api.getLanguages();

            return {
                ok: false,
                "error-messages": [
                    Object.fromEntries(await Promise.all(Object.entries({
                        ...languages.preferred,
                        ...languages.other
                    }).map(async ([
                        language
                    ]) => this.#localization_api.translate(
                        error instanceof Response ? "Server error!" : "Network error!",
                        null,
                        null,
                        language
                    ))))
                ]
            };
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #selectLanguage() {
        await (await this.#getLocalizationApi()).selectLanguage(
            async () => {
                await this.#ensureBeforeAndAfterSelectLanguage();
            },
            false
        );
    }
}
