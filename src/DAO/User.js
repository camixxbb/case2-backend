import ApplicationModel from "./ApplicationModel.js";

export default class User extends ApplicationModel {
    id; email; encryptedPassword; authToken;

    static configurar() {
        User.associate('id', 'ID')
        User.associate('email', 'EMAIL')
        User.associate('encryptedPassword', 'ENCRYPTED_PASSWORD')
        User.associate('authToken', 'AUTH_TOKEN')
    }
}