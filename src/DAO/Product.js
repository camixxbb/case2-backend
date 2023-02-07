import ApplicationModel from "./ApplicationModel.js";

export default class Product extends ApplicationModel {
    id; title; description;

    static configurar() {
        Product.associate('id', 'ID')
        Product.associate('title', 'TITLE')
        Product.associate('description', 'DESCRIPTION')
    }
}
