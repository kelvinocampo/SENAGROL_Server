import request from "supertest";
import { app } from "../../app";

describe("Productos con descuento", () => {
  test("✅ Debería devolver productos con descuento", async () => {
    const response = await request(app).get('/producto/discount');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);

    if (response.body.products.length > 0) {
      const producto = response.body.products[0];
      expect(producto).toHaveProperty('id_producto');
      expect(producto).toHaveProperty('nombre');
    }
  });

  test("❌ No debería fallar con error 500", async () => {
    const response = await request(app).get('/producto/discount');
    expect(response.status).not.toBe(500);
  });
});

describe("Obtener todos los productos", () => {
  test("✅ Debería devolver un array de productos", async () => {
    const response = await request(app).get('/producto');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);

    if (response.body.products.length > 0) {
      const producto = response.body.products[0];
      expect(producto).toHaveProperty('id_producto');
      expect(producto).toHaveProperty('nombre');
    }
  });
});

describe("Obtener producto por ID", () => {
  test("✅ Debería devolver la información de un producto existente", async () => {
    const response = await request(app).get('/producto/get/2'); // Asegúrate que este ID existe

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
    expect(response.body.products.length).toBeGreaterThan(0);

    const producto = response.body.products[0];
    expect(producto).toHaveProperty('id_producto');
    expect(producto).toHaveProperty('nombre');
  });

  test("❌ Debería devolver 404 si el producto no existe", async () => {
    const response = await request(app).get('/producto/get/999999'); // ID inexistente
    expect([404, 400]).toContain(response.status);
  });
});
