import ApplicationModel from "./ApplicationModel.js";

export default class Page extends ApplicationModel {
    id; title; text;

    static init() {
        Page.associate('id', 'ID')
        Page.associate('title', 'TITLE')
        Page.associate('text', 'TEXT')
    }
}
