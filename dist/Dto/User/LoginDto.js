"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Login {
    constructor(identifier, password) {
        this.identifier = identifier;
        if (identifier.includes('@')) {
            this.email = identifier;
            this.username = '';
        }
        else {
            this.username = identifier;
            this.email = '';
        }
        this.password = password;
    }
}
exports.default = Login;
