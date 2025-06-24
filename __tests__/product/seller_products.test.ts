import request from 'supertest';
import { app } from '../../app';
import { registerUser, loginUser } from '../user/auth'; // Reutilizamos tus funciones

describe('🛒 Obtener productos del vendedor autenticado', () => {
  test('✅ Debería devolver los productos del vendedor con token válido', async () => {
    // Generar datos únicos
    const timestamp = Date.now();
    const username = `vendedor_${timestamp}`;
    const email = `vendedor_${timestamp}@test.com`;

    // Registrar usuario
    const registerRes = await registerUser({ username, email });
    expect([200, 201]).toContain(registerRes.status);

    // Login
    const loginRes = await loginUser({ identifier: username, password: 'Password123!' });
    expect(loginRes.status).toBe(200);

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    // Asignar rol de vendedor
    const roleRes = await request(app)
      .patch('/usuario/role')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'vendedor' });

    expect([200, 201]).toContain(roleRes.status);

    // Obtener productos del vendedor
    const response = await request(app)
      .get('/producto/my_products')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 204]).toContain(response.status);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test('❌ No debería permitir acceso sin token', async () => {
    const response = await request(app).get('/producto/my_products');
    expect([401, 403]).toContain(response.status);
  });
});
