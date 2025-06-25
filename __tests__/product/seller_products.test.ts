import request from 'supertest';
import { app } from '../../app';
import { loginUser } from '../user/auth.test'; // Asegúrate que exporta loginUser

describe('🛒 Productos del vendedor autenticado', () => {
  test('✅ Debería devolver los productos del vendedor con token válido', async () => {
    // 1. Hacer login con un usuario ya existente
    const loginRes = await loginUser({
      identifier: 'luisag',           // tu usuario
      password: 'Password123!',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    const token = loginRes.body.token;

    // 2. Llamar al endpoint protegido
    const response = await request(app)
      .get('/producto/my_products')
      .set('Authorization', `Bearer ${token}`);

    // 3. Validar la respuesta
    expect([200, 204]).toContain(response.status);
    if (response.status === 200) {
      expect(Array.isArray(response.body.products)).toBe(true);
    }
  });

  test('❌ No debería permitir acceso sin token', async () => {
    const response = await request(app).get('/producto/my_products');
    expect([401, 403]).toContain(response.status);
  });
});
