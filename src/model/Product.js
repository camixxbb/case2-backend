import ApplicationModel from "./ApplicationModel.js";

export default class Product extends ApplicationModel {
    id; title; description;

    static init() {
        Product.correlate('id', 'ID')
        Product.correlate('title', 'TITLE')
        Product.correlate('description', 'DESCRIPTION')
    }
}
