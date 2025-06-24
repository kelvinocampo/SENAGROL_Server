import request from 'supertest';
import { app } from '../../app'; // Ajusta la ruta si es distinta

describe('Productos con descuento', () => {
  test('✅ Debería devolver productos con descuento', async () => {
    const response = await request(app).get('/producto/discount');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);

    if (response.body.products.length > 0) {
      const producto = response.body.products[0];
      expect(producto).toHaveProperty('id_producto');
      expect(producto).toHaveProperty('nombre');
      expect(producto).toHaveProperty('precio_unidad');
      expect(producto).toHaveProperty('descuento');
    }
  });

  test('❌ No debería fallar con error 500', async () => {
    const response = await request(app).get('/producto/discount');
    expect(response.status).not.toBe(500);
  });
});

describe('Obtener todos los productos', () => {
  test('✅ Debería devolver un array de productos', async () => {
    const response = await request(app).get('/producto/');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);

    if (response.body.products.length > 0) {
      const producto = response.body.products[0];
      expect(producto).toHaveProperty('id_producto');
      expect(producto).toHaveProperty('nombre');
    }
  });
});

describe('Obtener producto por ID', () => {
  test('✅ Debería devolver la información de un producto existente', async () => {
    const response = await request(app).get('/producto/get/2'); // Asegúrate que el ID 2 existe

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id_producto');
    expect(response.body).toHaveProperty('nombre');
  });

  test('❌ Debería devolver 404 si el producto no existe', async () => {
    const response = await request(app).get('/producto/get/999999'); // ID que no exista

    expect([404, 400]).toContain(response.status); // Acepta 404 o 400 según tu backend
  });
});
