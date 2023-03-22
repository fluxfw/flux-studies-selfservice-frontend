import { flux_css_api } from "../Libs/flux-css-api/src/FluxCssApi.mjs";
import { FormButtonElement } from "../FormButton/FormButtonElement.mjs";
import { MENU_ID_APPLICATION_LOGIN } from "../Menu/MENU_ID.mjs";

/** @typedef {import("../Libs/flux-color-scheme/src/FluxColorScheme.mjs").FluxColorScheme} FluxColorScheme */
/** @typedef {import("../Libs/flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../FluxStudisSelfserviceFrontend.mjs").FluxStudisSelfserviceFrontend} FluxStudisSelfserviceFrontend */
/** @typedef {import("../Layout/Layout.mjs").Layout} Layout */
/** @typedef {import("../Logout/logoutFunction.mjs").logoutFunction} logoutFunction */
/** @typedef {import("../Menu/Menu.mjs").Menu} Menu */
/** @typedef {import("../Menu/menuFunction.mjs").menuFunction} menuFunction */

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/MainElement.css`
);

export class MainElement extends HTMLElement {
    /**
     * @type {HTMLElement}
     */
    #content_element;
    /**
     * @type {FluxColorScheme}
     */
    #flux_color_scheme;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {FluxStudisSelfserviceFrontend}
     */
    #flux_studis_selfservice_frontend;
    /**
     * @type {HTMLDivElement}
     */
    #header_element;
    /**
     * @type {Layout}
     */
    #layout;
    /**
     * @type {HTMLDivElement}
     */
    #menu_element;
    /**
     * @type {ShadowRoot}
     */
    #shadow;
    /**
     * @type {HTMLDivElement | null}
     */
    #user_element = null;

    /**
     * @param {FluxColorScheme} flux_color_scheme
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxStudisSelfserviceFrontend} flux_studis_selfservice_frontend
     * @param {Layout} layout
     * @returns {MainElement}
     */
    static new(flux_color_scheme, flux_localization_api, flux_studis_selfservice_frontend, layout) {
        return new this(
            flux_color_scheme,
            flux_localization_api,
            flux_studis_selfservice_frontend,
            layout
        );
    }

    /**
     * @param {FluxColorScheme} flux_color_scheme
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {FluxStudisSelfserviceFrontend} flux_studis_selfservice_frontend
     * @param {Layout} layout
     * @private
     */
    constructor(flux_color_scheme, flux_localization_api, flux_studis_selfservice_frontend, layout) {
        super();

        this.#flux_color_scheme = flux_color_scheme;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_studis_selfservice_frontend = flux_studis_selfservice_frontend;
        this.#layout = layout;

        this.#shadow = this.attachShadow({ mode: "closed" });
        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @param {HTMLElement} content_element
     * @param {Menu | null} menu
     * @param {menuFunction | null} menu_function
     * @param {string | null} user_name
     * @param {logoutFunction | null} logout_function
     * @returns {Promise<void>}
     */
    async replaceContent(content_element, menu = null, menu_function = null, user_name = null, logout_function = null) {
        this.#content_element.innerHTML = "";
        this.#content_element.appendChild(content_element);

        this.#menu_element.innerHTML = "";
        if (menu !== null) {
            for (const id of menu.ids) {
                let label;
                switch (id) {
                    case MENU_ID_APPLICATION_LOGIN:
                        label = "Application / Login";
                        break;

                    default:
                        continue;
                }

                const menu_element = document.createElement("div");
                menu_element.classList.add("menu");

                if (id === menu.id) {
                    menu_element.dataset.active = true;
                }

                menu_element.innerText = await this.#flux_localization_api.translate(
                    label
                );
                if (menu_function !== null) {
                    menu_element.addEventListener("click", () => {
                        if (menu_element.dataset.active) {
                            return;
                        }

                        for (const _menu_element of this.#shadow.querySelectorAll(".menu[data-active]")) {
                            delete _menu_element.dataset.active;
                        }

                        menu_element.dataset.active = true;

                        menu_function(
                            id
                        );
                    });
                    this.#menu_element.appendChild(menu_element);
                }
            }
        }

        if (this.#user_element !== null) {
            this.#user_element.remove();
            this.#user_element = null;
        }

        if (user_name !== null || logout_function !== null) {
            this.#user_element = document.createElement("div");
            this.#user_element.classList.add("user");

            if (user_name !== null) {
                const user_name_element = document.createElement("div");
                user_name_element.classList.add("user_name");
                user_name_element.innerText = user_name;
                this.#user_element.appendChild(user_name_element);
            }

            if (logout_function !== null) {
                const logout_button_element = FormButtonElement.new(
                    await this.#flux_localization_api.translate(
                        "Logout"
                    )
                );
                logout_button_element.button.addEventListener("click", () => {
                    logout_function();
                });
                this.#user_element.appendChild(logout_button_element);
            }

            this.#header_element.appendChild(this.#user_element);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const container_element = document.createElement("div");
        container_element.classList.add("container");

        const left_element = document.createElement("div");
        left_element.classList.add("left");

        const title_element = document.createElement("div");
        title_element.classList.add("title");
        title_element.innerText = await this.#flux_localization_api.translate(
            "Studis selfservice"
        );
        left_element.appendChild(title_element);

        this.#menu_element = document.createElement("div");
        left_element.appendChild(this.#menu_element);

        left_element.appendChild(await this.#flux_color_scheme.getSelectColorSchemeElement());

        const logo_link_element = document.createElement("a");
        logo_link_element.classList.add("logo");
        logo_link_element.href = this.#layout["logo-link"];
        logo_link_element.rel = "noopener noreferrer";
        logo_link_element.target = "__blank";
        if (this.#layout["logo-link"] !== "") {
            logo_link_element.title = this.#layout["logo-title"];
        }

        left_element.appendChild(logo_link_element);

        container_element.appendChild(left_element);

        const right_element = document.createElement("div");
        right_element.classList.add("right");

        this.#header_element = document.createElement("div");
        this.#header_element.classList.add("header");

        this.#header_element.appendChild(await this.#flux_studis_selfservice_frontend.getSelectLanguageElement());

        const print_button_element = FormButtonElement.new(
            await this.#flux_localization_api.translate(
                "Print page"
            )
        );
        print_button_element.button.addEventListener("click", () => {
            this.#print();
        });
        this.#header_element.appendChild(print_button_element);

        right_element.appendChild(this.#header_element);

        const header2_element = document.createElement("div");
        header2_element.classList.add("header2");

        const arrow_element = document.createElement("div");
        arrow_element.classList.add("arrow");
        arrow_element.innerText = await this.#flux_localization_api.translate(
            "Application / Login"
        );
        header2_element.appendChild(arrow_element);

        right_element.appendChild(header2_element);

        this.#content_element = document.createElement("div");
        this.#content_element.classList.add("content");
        right_element.appendChild(this.#content_element);

        container_element.appendChild(right_element);

        this.#shadow.appendChild(container_element);
    }

    /**
     * @returns {void}
     */
    #print() {
        print();
    }
}

export const MAIN_ELEMENT_TAG_NAME = "flux-studis-selfservice-main";

customElements.define(MAIN_ELEMENT_TAG_NAME, MainElement);
