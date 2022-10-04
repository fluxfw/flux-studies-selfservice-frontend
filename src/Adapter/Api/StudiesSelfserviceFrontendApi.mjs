import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { FetchApi } from "../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs";
import { LabelService } from "../../Service/Label/Port/LabelService.mjs";
import { LoadingApi } from "../../Libs/flux-loading-api/src/Adapter/Api/LoadingApi.mjs";
import { MainElement } from "../Main/MainElement.mjs";
import { METHOD_POST } from "../../Libs/flux-fetch-api/src/Adapter/Method/METHOD.mjs";
import { PAGE_CHOICE_SUBJECT, PAGE_CREATE, PAGE_IDENTIFICATION_NUMBER, PAGE_INTENDED_DEGREE_PROGRAM, PAGE_INTENDED_DEGREE_PROGRAM_2, PAGE_RESUME, PAGE_START } from "../Page/PAGE.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("../ChoiceSubject/ChoiceSubjectElement.mjs").ChoiceSubjectElement} ChoiceSubjectElement */
/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../IdentificationNumber/IdentificationNumber.mjs").IdentificationNumber} IdentificationNumber */
/** @typedef {import("../IdentificationNumber/IdentificationNumberElement.mjs").IdentificationNumberElement} IdentificationNumberElement */
/** @typedef {import("../IntendedDegreeProgram/IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../IntendedDegreeProgram/IntendedDegreeProgramElement.mjs").IntendedDegreeProgramElement} IntendedDegreeProgramElement */
/** @typedef {import("../IntendedDegreeProgram2/IntendedDegreeProgram2.mjs").IntendedDegreeProgram2} IntendedDegreeProgram2 */
/** @typedef {import("../IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs").IntendedDegreeProgram2Element} IntendedDegreeProgram2Element */
/** @typedef {import("../../Libs/flux-loading-api/src/Adapter/Loading/LoadingElement.mjs").LoadingElement} LoadingElement */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/postFunction.mjs").postFunction} postFunction */
/** @typedef {import("../Post/PostResult.mjs").PostResult} PostResult */
/** @typedef {import("../Start/Start.mjs").Start} Start */
/** @typedef {import("../Start/StartElement.mjs").StartElement} StartElement */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class StudiesSelfserviceFrontendApi {
    /**
     * @type {CssApi | null}
     */
    #css_api = null;
    /**
     * @type {FetchApi | null}
     */
    #fetch_api = null;
    /**
     * @type {LabelService | null}
     */
    #label_service = null;
    /**
     * @type {LoadingApi | null}
     */
    #loading_api = null;
    /**
     * @type {MainElement | null}
     */
    #main_element = null;

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

        this.#loading_api ??= await this.#getLoadingApi();

        this.#label_service ??= this.#getLabelService();

        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../style.css`
        );

        document.title = "Studies selfservice";
    }

    /**
     * @returns {Promise<void>}
     */
    async showFrontend() {
        document.body.appendChild(this.#main_element = MainElement.new(
            this.#css_api
        ));

        await this.#next();
    }

    /**
     * @returns {Promise<void>}
     */
    async #back() {
        await this.#fetch_api.fetch({
            url: "/api/back",
            method: METHOD_POST
        });
    }

    /**
     * @returns {Promise<GetResult>}
     */
    async #get() {
        return this.#fetch_api.fetch({
            url: "/api/get"
        });
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
            choice_subject,
            async chosen_subject => {
                const post_result = await post_function(
                    {
                        page: PAGE_CHOICE_SUBJECT,
                        data: chosen_subject
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
            back_function
        );
    }

    /**
     * @returns {Promise<CssApi>}
     */
    async #getCssApi() {
        const css_api = CssApi.new(
            this.#fetch_api
        );

        await css_api.init();

        return css_api;
    }

    /**
     * @returns {Promise<FetchApi>}
     */
    async #getFetchApi() {
        const fetch_api = FetchApi.new(
            null,
            error => {
                console.error(error);

                alert("TODO: Error handling");

                return false;
            }
        );

        await fetch_api.init();

        return fetch_api;
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
            identification_number,
            async () => {
                const post_result = await post_function(
                    {
                        page: PAGE_IDENTIFICATION_NUMBER,
                        data: {}
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
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
            intended_degree_program,
            async chosen_intended_degree_program => {
                const post_result = await post_function(
                    {
                        page: PAGE_INTENDED_DEGREE_PROGRAM,
                        data: chosen_intended_degree_program
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
            back_function
        );
    }

    /**
     * @param {IntendedDegreeProgram2} intended_degree_program_2
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {Promise<getIntendedDegreeProgram2Element>}
     */
    async #getIntendedDegreeProgram2Element(intended_degree_program_2, post_function, back_function = null) {
        return (await import("../IntendedDegreeProgram2/IntendedDegreeProgram2Element.mjs")).IntendedDegreeProgram2Element.new(
            this.#css_api,
            this.#label_service,
            intended_degree_program_2,
            async chosen_intended_degree_program_2 => {
                const post_result = await post_function(
                    {
                        page: PAGE_INTENDED_DEGREE_PROGRAM_2,
                        data: chosen_intended_degree_program_2
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
            back_function
        );
    }

    /**
     * @returns {LabelService}
     */
    #getLabelService() {
        return LabelService.new();
    }

    /**
     * @returns {Promise<LoadingApi>}
     */
    async #getLoadingApi() {
        const loading_api = LoadingApi.new(
            this.#css_api
        );

        await loading_api.init();

        return loading_api;
    }

    /**
     * @returns {LoadingElement}
     */
    #getLoadingElement() {
        const loading_element = this.#loading_api.getLoadingElement();
        document.body.appendChild(loading_element);
        return loading_element;
    }

    /**
     * @param {GetResult} get_result
     * @param {postFunction} post_function
     * @param {backFunction} back_function
     * @returns {Promise<HTMLElement>}
     */
    async #getPage(get_result, post_function, back_function) {
        const _back_function = get_result.can_back ? back_function : null;

        switch (get_result.page) {
            case PAGE_CHOICE_SUBJECT:
                return this.#getChoiceSubjectElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case PAGE_IDENTIFICATION_NUMBER:
                return this.#getIdentificationNumberElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case PAGE_INTENDED_DEGREE_PROGRAM:
                return this.#getIntendedDegreeProgramElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case PAGE_INTENDED_DEGREE_PROGRAM_2:
                return this.#getIntendedDegreeProgram2Element(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case PAGE_CREATE:
            case PAGE_RESUME:
            case PAGE_START:
                return this.#getStartElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            default:
                alert("TODO: Unsupported page handling");
                break;
        }
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
            start,
            async create => {
                const post_result = await post_function(
                    {
                        page: PAGE_CREATE,
                        data: create
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
            async resume => {
                const post_result = await post_function(
                    {
                        page: PAGE_RESUME,
                        data: resume
                    }
                );

                if (post_result.ok) {
                    return;
                }

                alert("TODO: Post non-ok handling");
            },
            back_function
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #next() {
        scroll(0, 0);

        const get_loading_element = this.#getLoadingElement();

        let page;
        try {
            page = await this.#getPage(
                await this.#get(),
                async post => {
                    const post_loading_element = this.#getLoadingElement();

                    let post_result;
                    try {
                        post_result = await this.#post(
                            post
                        );
                    } catch (error) {
                        console.error(error);

                        alert("TODO: Post error handling");

                        return {
                            ok: false
                        };
                    } finally {
                        post_loading_element.remove();
                    }

                    if (!post_result.ok) {
                        return post_result;
                    }

                    this.#next();

                    return post_result;
                },
                async () => {
                    const back_loading_element = this.#getLoadingElement();

                    try {
                        await this.#back();
                    } catch (error) {
                        console.error(error);

                        alert("TODO: Back error handling");

                        return;
                    } finally {
                        back_loading_element.remove();
                    }

                    this.#next();
                }
            );
        } catch (error) {
            console.error(error);

            alert("TODO: Get error handling");

            return;
        } finally {
            get_loading_element.remove();
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
        return this.#fetch_api.fetch({
            url: "/api/post",
            method: METHOD_POST,
            data: post
        });
    }
}
