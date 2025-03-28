"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    // Constructor
    constructor(name, username, email, password, faceScan, phoneNumber) {
        this._name = name;
        this._username = username;
        this._email = email;
        this._password = password;
        this._faceScan = faceScan;
        this._phoneNumber = phoneNumber;
    }
    // Properties
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get username() {
        return this._username;
    }
    set username(username) {
        this._username = username;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this._email = email;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
    }
    get faceScan() {
        return this._faceScan;
    }
    set faceScan(faceScan) {
        this._faceScan = faceScan;
    }
    get phoneNumber() {
        return this._phoneNumber;
    }
    set phoneNumber(phoneNumber) {
        this._phoneNumber = phoneNumber;
    }
}
exports.default = User;
