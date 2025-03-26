class Login {
    readonly identifier: string;
    readonly email: string;
    readonly username: string;
    readonly password: string;

    constructor(identifier: string, password: string) {
        this.identifier = identifier;
        if (identifier.includes('@')) {
            this.email = identifier;
            this.username = '';
        } else {
            this.username = identifier;
            this.email = '';
        }
        this.password = password;
    }
}

export default Login;
