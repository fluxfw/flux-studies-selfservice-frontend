import { CssApi } from "../../../../flux-css-api/src/Adapter/Api/CssApi.mjs";
import { FetchApi } from "../../../../flux-fetch-api/src/Adapter/Api/FetchApi.mjs";
import { MainElement } from "../Main/MainElement.mjs";
import { StartElement } from "../Start/StartElement.mjs";
import { ELEMENT_CREATE, ELEMENT_RESUME, ELEMENT_ROOT, ELEMENT_START } from "../Element/ELEMENT.mjs";

/** @typedef {import("../Get/GetResult.mjs").GetResult} GetResult */
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
     * @returns {Promise<GetResult>}
     */
    async #get() {
        try {
            return await this.#fetch_api.fetch({
                url: "/api/get"
            });
        } catch (error) {
            console.error("GET", error);

            return {
                data: {},
                element: null
            };
        }
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
     * @param {GetResult} get_result
     * @param {postFunction} post_function
     * @returns {HTMLElement}
     */
    #getNextElement(get_result, post_function) {
        switch (get_result.element) {
            case ELEMENT_CREATE:
            case ELEMENT_RESUME:
            case ELEMENT_ROOT:
            case ELEMENT_START:
                return this.#getStartElement(
                    post_function,
                    get_result.data
                );

            default:
                throw new Error(`Element ${get_result.element} is not supported`);
        }
    }

    /**
     * @param {postFunction} post_function
     * @param {Start} start
     * @returns {StartElement}
     */
    #getStartElement(post_function, start) {
        return StartElement.new(
            async create => {
                const post_result = await post_function(
                    {
                        data: create,
                        element: ELEMENT_CREATE
                    }
                );

                if (post_result.ok) {
                    return;
                }
            },
            this.#css_api,
            async resume => {
                const post_result = await post_function(
                    {
                        data: resume,
                        element: ELEMENT_RESUME
                    }
                );

                if (post_result.ok) {
                    return;
                }
            },
            start
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #next() {
        try {
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
                    }
                )
            );
        } catch (error) {
            console.error(error);

            this.#main_element.replaceContent(
                "TODO"
            );
        }
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async #post(post) {
        try {
            return await this.#fetch_api.fetch({
                url: "/api/post",
                method: "POST",
                data: post
            });
        } catch (error) {
            console.error("POST", error);

            return {
                ok: false
            };
        }
    }
}
