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
        .send(userData); // <-- corregido
};

// usuario/login
export const loginUser = async (overrideData = {}) => {
    const userData = {
        identifier: 'juanperez',
        password: 'Password123!',
        ...overrideData
    };

    return request(app)
        .post('/usuario/login')
        .send(userData); // <-- corregido
};

describe("Autenticación de usuario", () => {
    test("✅ Registrar usuario exitosamente", async () => {
        const response = await registerUser();
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('register ok');
    });

    test("❌ Fallo al registrar con email inválido", async () => {
        const response = await registerUser({ email: "no-es-un-correo" });
        expect(response.status).toBe(422);
        expect(response.body.errores).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ param: 'email' })
            ])
        );
    });
});