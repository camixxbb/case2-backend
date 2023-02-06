import ApplicationModel from "./ApplicationModel.js";

export default class User extends ApplicationModel {
    id; email; encryptedPassword; authToken;

    static init() {
        User.correlate('id', 'ID')
        User.correlate('email', 'EMAIL')
        User.correlate('encryptedPassword', 'ENCRYPTED_PASSWORD')
        User.correlate('authToken', 'AUTH_TOKEN')
    }
}