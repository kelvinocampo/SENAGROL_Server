import request from 'supertest';
import { app } from '../../app';
import { loginUser } from '../user/auth.test';
import path from 'path';

// transportador/requestTransporter
const requestTransporter = async (overrideLoginData = {}) => {
    const userData = {
        identifier: 'mariar',
        password: 'Password123!',
        ...overrideLoginData
    };
    const loggedUser = await loginUser(userData)
    const { token } = loggedUser.body
    const imagePath = path.join(__dirname, '../assets/car_test.jpg')

    return request(app)
        .post('/transportador/requestTransporter')
        .set('Authorization', `Bearer ${token}`)
        .field('license', 'ABC123456')
        .field('soat', 'SOAT123456')
        .field('vehicleCard', 'TPV123456')
        .field('vehicleType', 'Camión')
        .field('vehicleWeight', '3500.50')
        .attach('imagen', imagePath);
}

// transportador/transports
const getTransports = async (overrideData = {}) => {
    const userData = {
        identifier: 'sofiad',
        password: 'Password123!',
        ...overrideData
    };
    const loggedUser = await loginUser(userData)
    const { token } = loggedUser.body
    return request(app)
        .get('/transportador/transports')
        .set('Authorization', `Bearer ${token}`)
}

describe("Peticion de transportador", () => {
    test("Peticion de transportador enviada exitosamente", async () => {
        const response = await requestTransporter();
        const body = response.body;
        expect(body.success).toBeTruthy()
    });
});

describe("Mis transportes", () => {
    test("Transportes obtenidos exitosamente", async () => {
        const response = await getTransports();
        const body = response.body;
        expect(body.success).toBeTruthy()
        expect(Array.isArray(body.transports)).toBe(true);
    });
});