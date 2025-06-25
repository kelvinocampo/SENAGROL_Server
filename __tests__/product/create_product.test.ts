import request from 'supertest';
import path from 'path';
import { app } from '../../app';
import { loginUser } from '../user/auth.test';

describe('🛒 Crear producto por un vendedor', () => {
  const testImagePath = path.join(__dirname, '../assets/test-image.png');

  test('✅ Debería permitir crear un producto con token válido y rol vendedor', async () => {
    const loginRes = await loginUser({
      identifier: 'ricardos', // Asegúrate de que este usuario exista
      password: 'Password123!',
    });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const response = await request(app)
      .post('/producto/create')
      .set('Authorization', `Bearer ${token}`)
      .field('Nombre', 'Producto Test')
      .field('Description', 'Descripción de prueba')
      .field('Precio', '100')
      .field('Stock', '50') // Aunque no se usa, no afecta
      .field('categoria', 'verduras')
      .field('latitud', '4.60971')
      .field('longitud', '-74.08175')
      .field('quantity', '100')
      .field('MinimumQuantity', '1')
      .field('Discount', '10')
      .attach('imagen', testImagePath);

    console.log('👉 Body respuesta del backend:', response.body);

    // Validaciones
    expect([200, 201]).toContain(response.status);
    expect(response.body.status).toBeDefined();
    expect(response.body.status).toMatch(/ok/i); // Coincide con "register ok"
  });
});
