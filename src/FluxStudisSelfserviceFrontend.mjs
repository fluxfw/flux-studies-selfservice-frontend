import { flux_css_api } from "./Libs/flux-css-api/src/FluxCssApi.mjs";
import { HttpClientResponse } from "./Libs/flux-http-api/src/Client/HttpClientResponse.mjs";
import { LOCALIZATION_MODULE } from "./Localization/LOCALIZATION_MODULE.mjs";
import { LOCALIZATIONS_STUDIS_SELFSERVICE_FRONTENDSTUDIS_SELFSERVICE_FRONTEND } from "./Localization/LOCALIZATIONS.mjs";
import { LOCALIZATION_KEY_NETWORK_ERROR, LOCALIZATION_KEY_PAGE_ERROR, LOCALIZATION_KEY_SERVER_ERROR } from "./Localization/LOCALIZATION_KEY.mjs";
import { PAGE_CHOICE_SUBJECT, PAGE_COMPLETED, PAGE_CREATE, PAGE_IDENTIFICATION_NUMBER, PAGE_INTENDED_DEGREE_PROGRAM, PAGE_INTENDED_DEGREE_PROGRAM_2, PAGE_LEGAL, PAGE_PERSONAL_DATA, PAGE_PORTRAIT, PAGE_PREVIOUS_STUDIES, PAGE_RESUME, PAGE_START, PAGE_UNIVERSITY_ENTRANCE_QUALIFICATION } from "./Page/PAGE.mjs";

/** @typedef {import("./Back/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("./ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("./ChoiceSubject/ChoiceSubjectElement.mjs").ChoiceSubjectElement} ChoiceSubjectElement */
/** @typedef {import("./Completed/CompletedElement.mjs").CompletedElement} CompletedElement */
/** @typedef {import("./Libs/flux-button-group/src/FluxButtonGroupElement.mjs").FluxButtonGroupElement} FluxButtonGroupElement */
/** @typedef {import("./Libs/flux-color-scheme/src/FluxColorScheme.mjs").FluxColorScheme} FluxColorScheme */
/** @typedef {import("./Libs/flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("./Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./Libs/flux-pwa-api/src/FluxPwaApi.mjs").FluxPwaApi} FluxPwaApi */
/** @typedef {import("./Libs/flux-settings-storage/src/FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */
/** @typedef {import("./FormInvalid/FormInvalidElement.mjs").FormInvalidElement} FormInvalidElement */
/** @typedef {import("./Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("./IdentificationNumber/IdentificationNumber.mjs").IdentificationNumber} IdentificationNumber */
/** @typedef {import("./IdentificationNumber/IdentificationNumberElement.mjs").IdentificationNumberElement} IdentificationNumberElement */
/** @typedef {import("./IntendedDegreeProgram/IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("./IntendedDegreeProgram/IntendedDegreeProgramElement.mjs").IntendedDegreeProgramElement} IntendedDegreeProgramElement */
/** @typedef {import("./IntendedDegreeProgram2/IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("./IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs").IntendedDegreeProgram2Element} IntendedDegreeProgram2Element */
/** @typedef {import("./Label/LabelService.mjs").LabelService} LabelService */
/** @typedef {import("./Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("./Legal/Legal.mjs").Legal} Legal */
/** @typedef {import("./Legal/LegalElement.mjs").LegalElement} LegalElement */
/** @typedef {import("./Main/MainElement.mjs").MainElement} MainElement */
/** @typedef {import("./Password/PasswordService.mjs").PasswordService} PasswordService */
/** @typedef {import("./PersonalData/PersonalData.mjs").PersonalData} PersonalData */
/** @typedef {import("./PersonalData/PersonalDataElement.mjs").PersonalDataElement} PersonalDataElement */
/** @typedef {import("./Photo/PhotoService.mjs").PhotoService} PhotoService */
/** @typedef {import("./Portrait/Portrait.mjs").Portrait} Portrait */
/** @typedef {import("./Portrait/PortraitElement.mjs").PortraitElement} PortraitElement */
/** @typedef {import("./PreviousStudies/PreviousStudies.mjs").PreviousStudies} PreviousStudies */
/** @typedef {import("./PreviousStudies/PreviousStudiesElement.mjs").PreviousStudiesElement} PreviousStudiesElement */
/** @typedef {import("./Post/postFunction.mjs").postFunction} postFunction */
/** @typedef {import("./Request/RequestService.mjs").RequestService} RequestService */
/** @typedef {import("./Start/Start.mjs").Start} Start */
/** @typedef {import("./Start/StartElement.mjs").StartElement} StartElement */
/** @typedef {import("./UniversityEntranceQualification/UniversityEntranceQualification.mjs").UniversityEntranceQualification} UniversityEntranceQualification */
/** @typedef {import("./UniversityEntranceQualification/UniversityEntranceQualificationElement.mjs").UniversityEntranceQualificationElement} UniversityEntranceQualificationElement */

const layout_css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Layout/style.css`
);

document.adoptedStyleSheets.push(layout_css);

export class FluxStudisSelfserviceFrontend {
    /**
     * @type {FluxColorScheme | null}
     */
    #flux_color_scheme = null;
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api = null;
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api = null;
    /**
     * @type {FluxPwaApi | null}
     */
    #flux_pwa_api = null;
    /**
     * @type {FluxSettingsStorage | null}
     */
    #flux_settings_storage = null;
    /**
     * @type {LabelService | null}
     */
    #label_service = null;
    /**
     * @type {Layout | null}
     */
    #layout = null;
    /**
     * @type {MainElement | null}
     */
    #main_element = null;
    /**
     * @type {PasswordService | null}
     */
    #password_service = null;
    /**
     * @type {PhotoService | null}
     */
    #photo_service = null;
    /**
     * @type {GetResult | null}
     */
    #previous_get_result = null;
    /**
     * @type {RequestService | null}
     */
    #request_service = null;

    /**
     * @returns {FluxStudisSelfserviceFrontend}
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
     * @param {boolean | null} previous_get_result
     * @returns {Promise<void>}
     */
    async showFrontend(previous_get_result = null) {
        if (previous_get_result === null) {
            await this.#init();
        }

        document.body.append(this.#main_element = (await import("./Main/MainElement.mjs")).MainElement.new(
            await this.#getFluxColorScheme(),
            await this.#getFluxLocalizationApi(),
            this,
            await this.#getLayout()
        ));

        await this.#next(
            previous_get_result
        );
    }

    /**
     * @returns {Promise<FluxButtonGroupElement>}
     */
    async getSelectLanguageElement() {
        return (await this.#getFluxLocalizationApi()).getSelectLanguageElement(
            LOCALIZATION_MODULE,
            async () => {
                await this.#afterSelectLanguage(
                    true
                );
            }
        );
    }

    /**
     * @param {boolean | null} ui
     * @returns {Promise<void>}
     */
    async #afterSelectLanguage(ui = null) {
        await (await this.#getFluxPwaApi()).initPwa(
            `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Manifest/manifest.json`,
            LOCALIZATION_MODULE
        );

        if (!(ui ?? false)) {
            return;
        }

        this.#main_element.remove();
        this.#main_element = null;

        this.showFrontend(
            true
        );
    }

    /**
     * @param {ChoiceSubject} choice_subject
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<ChoiceSubjectElement>}
     */
    async #getChoiceSubjectElement(choice_subject, post_function, back_function = null) {
        return (await import("./ChoiceSubject/ChoiceSubjectElement.mjs")).ChoiceSubjectElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
     * @param {backFunction | null} back_function
     * @returns {Promise<CompletedElement>}
     */
    async #getCompletedElement(back_function = null) {
        return (await import("./Completed/CompletedElement.mjs")).CompletedElement.new(
            await this.#getFluxLocalizationApi(),
            back_function
        );
    }

    /**
     * @returns {Promise<FluxColorScheme>}
     */
    async #getFluxColorScheme() {
        this.#flux_color_scheme ??= await (await import("./Libs/flux-color-scheme/src/FluxColorScheme.mjs")).FluxColorScheme.new(
            null,
            null,
            null,
            [
                ...(await import("./Libs/flux-color-scheme/src/ColorScheme/COLOR_SCHEME_VARIABLE.mjs")).DEFAULT_COLOR_SCHEME_VARIABLES,
                "container-border-color",
                "form-background-color",
                "form-buttons-background-color",
                "input-border-color",
                "left-background-color",
                "left-border-color"
            ],
            null,
            null,
            null,
            await this.#getFluxLocalizationApi(),
            await this.#getFluxSettingsStorage()
        );

        return this.#flux_color_scheme;
    }

    /**
     * @returns {Promise<FluxHttpApi>}
     */
    async #getFluxHttpApi() {
        this.#flux_http_api ??= (await import("./Libs/flux-http-api/src/FluxHttpApi.mjs")).FluxHttpApi.new();

        return this.#flux_http_api;
    }

    /**
     * @returns {Promise<FluxLocalizationApi>}
     */
    async #getFluxLocalizationApi() {
        this.#flux_localization_api ??= await (await import("./Libs/flux-localization-api/src/FluxLocalizationApi.mjs")).FluxLocalizationApi.new(
            await this.#getFluxSettingsStorage()
        );

        return this.#flux_localization_api;
    }

    /**
     * @returns {Promise<FluxPwaApi>}
     */
    async #getFluxPwaApi() {
        this.#flux_pwa_api ??= await (await import("./Libs/flux-pwa-api/src/FluxPwaApi.mjs")).FluxPwaApi.new(
            await this.#getFluxHttpApi(),
            await this.#getFluxLocalizationApi(),
            await this.#getFluxSettingsStorage()
        );

        return this.#flux_pwa_api;
    }

    /**
     * @returns {Promise<FluxSettingsStorage>}
     */
    async #getFluxSettingsStorage() {
        if (this.#flux_settings_storage === null) {
            const {
                SETTINGS_STORAGE_INDEXEDDB_DATABASE_NAME,
                SETTINGS_STORAGE_INDEXEDDB_STORE_NAME
            } = await import("./SettingsStorage/SETTINGS_STORAGE.mjs");

            this.#flux_settings_storage ??= await (await import("./Libs/flux-settings-storage/src/Browser/getBrowserFluxSettingsStorage.mjs")).getBrowserFluxSettingsStorage(
                SETTINGS_STORAGE_INDEXEDDB_DATABASE_NAME,
                SETTINGS_STORAGE_INDEXEDDB_STORE_NAME
            );
        }

        return this.#flux_settings_storage;
    }

    /**
     * @param {string} message
     * @returns {Promise<FormInvalidElement>}
     */
    async #getFormInvalidElement(message) {
        return (await import("./FormInvalid/FormInvalidElement.mjs")).FormInvalidElement.new(
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
        return (await import("./IdentificationNumber/IdentificationNumberElement.mjs")).IdentificationNumberElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
        return (await import("./IntendedDegreeProgram/IntendedDegreeProgramElement.mjs")).IntendedDegreeProgramElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
        return (await import("./IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs")).IntendedDegreeProgram2Element.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
     * @returns {Promise<LabelService>}
     */
    async #getLabelService() {
        this.#label_service ??= (await import("./Label/LabelService.mjs")).LabelService.new(
            await this.#getFluxLocalizationApi()
        );

        return this.#label_service;
    }

    /**
     * @returns {Promise<Layout>}
     */
    async #getLayout() {
        this.#layout ??= await (await this.#getRequestService()).layout();

        return this.#layout;
    }

    /**
     * @param {Legal} legal
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<LegalElement>}
     */
    async #getLegalElement(legal, post_function, back_function = null) {
        return (await import("./Legal/LegalElement.mjs")).LegalElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
                await (await this.#getFluxLocalizationApi()).translate(
                    LOCALIZATION_MODULE,
                    LOCALIZATION_KEY_PAGE_ERROR
                )
            );
        }
    }

    /**
     * @returns {Promise<PasswordService>}
     */
    async #getPasswordService() {
        this.#password_service ??= (await import("./Password/PasswordService.mjs")).PasswordService.new();

        return this.#password_service;
    }

    /**
     * @param {PersonalData} personal_data
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<PersonalDataElement>}
     */
    async #getPersonalDataElement(personal_data, post_function, back_function = null) {
        return (await import("./PersonalData/PersonalDataElement.mjs")).PersonalDataElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
        this.#photo_service ??= (await import("./Photo/PhotoService.mjs")).PhotoService.new(
            await this.#getFluxLocalizationApi()
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
        return (await import("./Portrait/PortraitElement.mjs")).PortraitElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
        return (await import("./PreviousStudies/PreviousStudiesElement.mjs")).PreviousStudiesElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
     * @returns {Promise<RequestService>}
     */
    async #getRequestService() {
        this.#request_service ??= (await import("./Request/RequestService.mjs")).RequestService.new(
            await this.#getFluxHttpApi()
        );

        return this.#request_service;
    }

    /**
     * @param {Start} start
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<StartElement>}
     */
    async #getStartElement(start, post_function, back_function = null) {
        return (await import("./Start/StartElement.mjs")).StartElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
            await this.#getPasswordService(),
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
        return (await import("./UniversityEntranceQualification/UniversityEntranceQualificationElement.mjs")).UniversityEntranceQualificationElement.new(
            await this.#getFluxLocalizationApi(),
            await this.#getLabelService(),
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
    async #init() {
        const flux_localization_api = await this.#getFluxLocalizationApi();

        await flux_localization_api.addModule(
            LOCALIZATION_MODULE,
            LOCALIZATIONS_STUDIS_SELFSERVICE_FRONTENDSTUDIS_SELFSERVICE_FRONTEND
        );

        await this.#afterSelectLanguage();
    }

    /**
     * @param {boolean | null} previous_get_result
     * @returns {Promise<void>}
     */
    async #next(previous_get_result = null) {
        scroll(0, 0);

        const get_flux_overlay_element = await (await import("./Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading();

        try {
            if (!(previous_get_result ?? false) || this.#previous_get_result === null) {
                this.#previous_get_result = await (await this.#getRequestService()).get();
            } else {
                await new Promise(resolve => {
                    setTimeout(resolve, 10);
                });
            }
        } catch (error) {
            console.error(error);

            this.#previous_get_result = null;

            await this.#main_element.replaceContent(
                await this.#getFormInvalidElement(
                    await this.#flux_localization_api.translate(
                        LOCALIZATION_MODULE,
                        error instanceof HttpClientResponse ? LOCALIZATION_KEY_SERVER_ERROR : LOCALIZATION_KEY_NETWORK_ERROR
                    )
                )
            );

            return;
        } finally {
            get_flux_overlay_element.remove();
        }

        await this.#main_element.replaceContent(
            await this.#getPage(
                this.#previous_get_result,
                async post => {
                    const post_flux_overlay_element = await (await import("./Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading();

                    let post_result;
                    try {
                        post_result = await (await this.#getRequestService()).post(
                            post
                        );
                    } catch (error) {
                        console.error(error);

                        return {
                            ok: false,
                            "error-messages": [
                                Object.fromEntries(await Promise.all(Object.entries((await this.#flux_localization_api.getLanguages(
                                    LOCALIZATION_MODULE
                                )).all).map(async ([
                                    language
                                ]) => [
                                        language,
                                        await this.#flux_localization_api.translate(
                                            LOCALIZATION_MODULE,
                                            error instanceof HttpClientResponse ? LOCALIZATION_KEY_SERVER_ERROR : LOCALIZATION_KEY_NETWORK_ERROR,
                                            null,
                                            language
                                        )
                                    ]
                                )))
                            ]
                        };
                    } finally {
                        post_flux_overlay_element.remove();
                    }

                    if (!post_result.ok) {
                        return post_result;
                    }

                    this.#next();

                    return post_result;
                },
                async () => {
                    this.#previous_get_result = null;

                    const back_flux_overlay_element = await (await import("./Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading();

                    try {
                        await (await this.#getRequestService()).back();
                    } catch (error) {
                        console.error(error);

                        await this.#main_element.replaceContent(
                            await this.#getFormInvalidElement(
                                await this.#flux_localization_api.translate(
                                    LOCALIZATION_MODULE,
                                    error instanceof HttpClientResponse ? LOCALIZATION_KEY_SERVER_ERROR : LOCALIZATION_KEY_NETWORK_ERROR
                                )
                            )
                        );

                        return;
                    } finally {
                        back_flux_overlay_element.remove();
                    }

                    this.#next();
                }
            ),
            this.#previous_get_result["menu"],
            async id => {
                this.#previous_get_result = null;

                const menu_flux_overlay_element = await (await import("./Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading();

                try {
                    await (await this.#getRequestService()).menu(
                        id
                    );
                } catch (error) {
                    console.error(error);

                    await this.#main_element.replaceContent(
                        await this.#getFormInvalidElement(
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                error instanceof HttpClientResponse ? LOCALIZATION_KEY_SERVER_ERROR : LOCALIZATION_KEY_NETWORK_ERROR
                            )
                        )
                    );

                    return;
                } finally {
                    menu_flux_overlay_element.remove();
                }

                this.#next();
            },
            this.#previous_get_result["user-name"],
            this.#previous_get_result["can-logout"] ? async () => {
                this.#previous_get_result = null;

                const logout_flux_overlay_element = await (await import("./Libs/flux-overlay/src/FluxOverlayElement.mjs")).FluxOverlayElement.loading();

                try {
                    await (await this.#getRequestService()).logout();
                } catch (error) {
                    console.error(error);

                    await this.#main_element.replaceContent(
                        await this.#getFormInvalidElement(
                            await this.#flux_localization_api.translate(
                                LOCALIZATION_MODULE,
                                error instanceof HttpClientResponse ? LOCALIZATION_KEY_SERVER_ERROR : LOCALIZATION_KEY_NETWORK_ERROR
                            )
                        )
                    );

                    return;
                } finally {
                    logout_flux_overlay_element.remove();
                }

                this.#next();
            } : null
        );
    }
}
