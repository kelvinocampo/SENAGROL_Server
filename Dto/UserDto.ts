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
//Define la estructura esperada en el cuerpo de la solicitud del cambio de contraseña .
export class UpdatePasswordDto {
    password: string;
    repeatPassword: string;

    constructor(password: string, repeatPassword: string) {
        this.password = password;
        this.repeatPassword = repeatPassword;
    }
}
