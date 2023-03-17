/** @typedef {import("../../Photo/PhotoCrop.mjs").PhotoCrop} PhotoCrop */

export class GetRectangleFromEventCommand {
    /**
     * @returns {GetRectangleFromEventCommand}
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
     * @param {HTMLElement} container_element
     * @param {MouseEvent | Touch} start
     * @param {MouseEvent | Touch} event
     * @returns {Promise<PhotoCrop | null>}
     */
    async getRectangleFromEvent(container_element, start, event) {
        const container_rectangle = container_element.getClientRects()[0] ?? null;

        if (container_rectangle === null) {
            return null;
        }

        if (start.clientX < container_rectangle.left || start.clientX > container_rectangle.right) {
            return null;
        }
        if (start.clientY < container_rectangle.top || start.clientY > container_rectangle.bottom) {
            return null;
        }

        const startClientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, start.clientX > event.clientX ? event.clientX : start.clientX));
        const clientX = Math.max(container_rectangle.left, Math.min(container_rectangle.right, start.clientX < event.clientX ? event.clientX : start.clientX));

        const startClientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, start.clientY > event.clientY ? event.clientY : start.clientY));
        const clientY = Math.max(container_rectangle.top, Math.min(container_rectangle.bottom, start.clientY < event.clientY ? event.clientY : start.clientY));

        const x = Math.max(0, startClientX - container_rectangle.left);
        const y = Math.max(0, startClientY - container_rectangle.top);
        const width = Math.min(container_rectangle.width - x, Math.max(0, clientX - startClientX));
        const height = Math.min(container_rectangle.height - y, Math.max(0, clientY - startClientY));

        if (width === 0 && height === 0) {
            return null;
        }

        return {
            x: x * 100 / container_rectangle.width,
            y: y * 100 / container_rectangle.height,
            width: width * 100 / container_rectangle.width,
            height: height * 100 / container_rectangle.height
        };
    }
}
