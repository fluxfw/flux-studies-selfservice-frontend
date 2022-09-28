import { ChoiceSubjectElement } from "../ChoiceSubject/ChoiceSubjectElement.mjs";
import { CssApi } from "../../Libs/flux-css-api/src/Adapter/Api/CssApi.mjs";
import { FetchApi } from "../../Libs/flux-fetch-api/src/Adapter/Api/FetchApi.mjs";
import { IntendedDegreeProgramElement } from "../IntendedDegreeProgram/IntendedDegreeProgramElement.mjs";
import { MainElement } from "../Main/MainElement.mjs";
import { StartElement } from "../Start/StartElement.mjs";
import { ELEMENT_CHOICE_SUBJECT, ELEMENT_CREATE, ELEMENT_INTENDED_DEGREE_PROGRAM, ELEMENT_RESUME, ELEMENT_START } from "../Element/ELEMENT.mjs";

/** @typedef {import("../Post/backFunction.mjs").backFunction} backFunction */
/** @typedef {import("../ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../IntendedDegreeProgram/IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../Post/Post.mjs").Post} Post */
/** @typedef {import("../Post/postFunction.mjs").postFunction} postFunction */
/** @typedef {import("../Post/PostResult.mjs").PostResult} PostResult */
/** @typedef {import("../Start/Start.mjs").Start} Start */

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
            method: "POST"
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
     * @returns {ChoiceSubjectElement}
     */
    #getChoiceSubjectElement(choice_subject, post_function, back_function = null) {
        return ChoiceSubjectElement.new(
            this.#css_api,
            choice_subject,
            async chosen_subject => {
                const post_result = await post_function(
                    {
                        page: ELEMENT_CHOICE_SUBJECT,
                        data: chosen_subject
                    }
                );

                if (post_result.ok) {
                    return;
                }
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
        const fetch_api = FetchApi.new();

        await fetch_api.init();

        return fetch_api;
    }

    /**
     * @param {IntendedDegreeProgram} intended_degree_program
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {IntendedDegreeProgramElement}
     */
    #getIntendedDegreeProgramElement(intended_degree_program, post_function, back_function = null) {
        return IntendedDegreeProgramElement.new(
            this.#css_api,
            intended_degree_program,
            async chosen_intended_degree_program => {
                const post_result = await post_function(
                    {
                        page: ELEMENT_INTENDED_DEGREE_PROGRAM,
                        data: chosen_intended_degree_program
                    }
                );

                if (post_result.ok) {
                    return;
                }
            },
            back_function
        );
    }

    /**
     * @param {GetResult} get_result
     * @param {postFunction} post_function
     * @param {backFunction} back_function
     * @returns {HTMLElement}
     */
    #getNextElement(get_result, post_function, back_function) {
        const _back_function = get_result.can_back ?? false ? back_function : null;

        switch (get_result.page) {
            case ELEMENT_CHOICE_SUBJECT:
                return this.#getChoiceSubjectElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case ELEMENT_INTENDED_DEGREE_PROGRAM:
                return this.#getIntendedDegreeProgramElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            case ELEMENT_CREATE:
            case ELEMENT_RESUME:
            case ELEMENT_START:
                return this.#getStartElement(
                    get_result.data,
                    post_function,
                    _back_function
                );

            default:
                break;
        }
    }

    /**
     * @param {Start} start
     * @param {postFunction} post_function
     * @param {backFunction | null} back_function
     * @returns {StartElement}
     */
    #getStartElement(start, post_function, back_function = null) {
        return StartElement.new(
            this.#css_api,
            start,
            async create => {
                const post_result = await post_function(
                    {
                        page: ELEMENT_CREATE,
                        data: create
                    }
                );

                if (post_result.ok) {
                    return;
                }
            },
            async resume => {
                const post_result = await post_function(
                    {
                        page: ELEMENT_RESUME,
                        data: resume
                    }
                );

                if (post_result.ok) {
                    return;
                }
            },
            back_function
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #next() {
        this.#main_element.replaceContent(
            this.#getNextElement(
                await this.#get(),
                async post => {
                    const post_result = await this.#post(
                        post
                    );

                    if (!post_result.ok) {
                        return post_result;
                    }

                    this.#next();

                    return post_result;
                },
                async () => {
                    await this.#back();

                    this.#next();
                }
            )
        );
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async #post(post) {
        return this.#fetch_api.fetch({
            url: "/api/post",
            method: "POST",
            data: post
        });
    }
}
