export class User {
    private nombre: string;
    private email: string;
    private password: string;

    constructor(nombre: string, email: string, password: string) {
        this.nombre = nombre;
        this.email = email;
        this.password = password;
    }
}

