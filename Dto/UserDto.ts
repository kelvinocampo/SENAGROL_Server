class User {
    private _name: string;
    private _username: string;
    private _email: string;
    private _password: string;
    private _faceScan: string;
    private _phoneNumber: string;

    // Constructor
    constructor(
        name: string,
        username: string,
        email: string,
        password: string,
        faceScan: string,
        phoneNumber: string
    ) {
        this._name = name;
        this._username = username;
        this._email = email;
        this._password = password;
        this._faceScan = faceScan;
        this._phoneNumber = phoneNumber;
    }

    // Properties


    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get username(): string {
        return this._username;
    }

    set username(username: string) {
        this._username = username;
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get password(): string {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

    get faceScan(): string {
        return this._faceScan;
    }

    set faceScan(faceScan: string) {
        this._faceScan = faceScan;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(phoneNumber: string) {
        this._phoneNumber = phoneNumber;
    }
}

export default User;
