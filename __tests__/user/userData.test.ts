import request from 'supertest';
import { app } from '../../app';
import { loginUser } from './auth.test';

// usuario/
const getUser = async (overrideData = {}) => {
    const userData = {
        identifier: 'admin',
        password: 'Password123!',
        ...overrideData
    };
    const loggedUser = await loginUser(userData)
    const { token } = loggedUser.body
    console.log(token);
    return request(app)
        .get('/usuario/')
        .set('Authorization', `Bearer ${token}`)
}

// usuario/edit
const setUser = async (overrideLoginData = {}, overrideUserData = {}) => {
    const userData = {
        identifier: 'admin',
        password: 'Password123!',
        ...overrideLoginData,
    };
    const loggedUser = await loginUser(userData)
    const { token } = loggedUser.body

    const newUserData = {
        name: "admin",
        username: "admin",
        email: "admin@example.com",
        phone: "1234567890",
        password: "Password123!",
        ...overrideUserData,
    }

    return request(app)
        .put('/usuario/edit')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserData)
}

describe("Conseguir usuario", () => {
    test("Usuario conseguido exitosamente", async () => {
        const response = await getUser();
        const body = response.body;
        expect(response.status).toBe(200);
        expect(body.message).toBe("Perfil del usuario obtenido correctamente");
        const user = body.user["0"];
        expect(user).toHaveProperty("id_usuario")
        expect(user).toHaveProperty("nombre")
        expect(user).toHaveProperty("nombre_usuario")
        expect(user).toHaveProperty("correo")
        expect(user).toHaveProperty("contraseña")
        expect(user).toHaveProperty("telefono")
        expect(body.user).toHaveProperty("roles")
    });
});

describe("Editar usuario", () => {
    test("Usuario editado exitosamente", async () => {
        const response = await setUser();
        const body = response.body;
        expect(response.status).toBe(200);
        expect(body.message).toBe("Perfil actualizado correctamente");
        expect(body.user.success).toBeTruthy()
    });
});