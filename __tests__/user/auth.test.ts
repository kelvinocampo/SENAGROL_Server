import request from 'supertest';
import { app } from '../../app';

// usuario/register
export const registerUser = async (overrideData = {}) => {
    const userData = {
        name: 'Juan Pérez',
        username: 'juanperez',
        email: 'juan@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        phone: '1234567890',
        ...overrideData
    };

    return request(app)
        .post('/usuario/register')
        .send(userData);
};

// usuario/login
export const loginUser = async (overrideData = {}) => {
    const userData = {
        identifier: 'admin',
        password: 'Password123!',
        ...overrideData
    };

    return request(app)
        .post('/usuario/login')
        .send(userData);
};

describe("Registro de usuario", () => {
    test("Registrar usuario exitosamente", async () => {
        const response = await registerUser();
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('register ok');
    });
    test("Fallo al registrar con email inválido", async () => {
        const response = await registerUser({ email: "no-es-un-correo" });
        expect(response.status).toBe(422);
        expect(response.body.errores).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: 'email' })
            ])
        );
    });
});

describe("Iniciar Sesion", () => {
    test("Iniciar sesión exitosamente", async () => {
        await registerUser({
            username: 'usuarioLogin',
            email: 'login@example.com',
        });
        const response = await loginUser({
            identifier: 'usuarioLogin',
            password: 'Password123!'
        });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("Login exitoso");
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
    });
    test("Falló el Iniciar sesión por credenciales incorrectas", async () => {
        const response = await loginUser({
            identifier: 'usuarioInexistente',
            password: 'contraseñaIncorrecta'
        });
        console.log(response.body)
        expect(response.status).toBe(401);
        expect(response.body.status).toBe("Usuario o contraseña incorrectos");
    });
});
