import request from 'supertest';
import path from 'path';
import { app } from '../../app';
import { loginUser } from '../user/auth.test';

describe('🛠️ Editar producto por un vendedor', () => {
  const testImagePath = path.join(__dirname, '../assets/test-image.png');

  test('✅ Debería permitir editar un producto con token válido y rol vendedor', async () => {
    const loginRes = await loginUser({
      identifier: 'ricardos', // Usuario con rol vendedor
      password: 'Password123!',
    });

    const token = loginRes.body.token;
    expect(token).toBeDefined();

    const idProducto = 1; // Cambia esto según el producto que deseas editar

    const response = await request(app)
      .put(`/producto/edit/${idProducto}`)
      .set('Authorization', `Bearer ${token}`)
      .field('Nombre', 'Producto Editado')
      .field('Description', 'Descripción editada')
      .field('Precio', '200')
      .field('Stock', '60')
      .field('categoria', 'verduras')
      .field('latitud', '4.60123')
      .field('longitud', '-74.07231')
      .field('quantity', '150')
      .field('MinimumQuantity', '5')
      .field('Discount', '15')
      .attach('imagen', testImagePath);

    console.log('📝 Body respuesta del backend:', response.body);

    expect([200, 201]).toContain(response.status);
    expect(response.body.status).toBeDefined();
    expect(response.body.status).toMatch(/ok/i); // compatible con "update ok"
  });
});
