import db from '../Config/configDB';
import Product from '../Dto/Product/ProductsCreate';

class ProductRepository {

    static async createProduct(product: Product) {
        const ProductSql = `
            INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor, fecha_publicacion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [
            product.Nombre,
            product.Description,
            product.latitud,
            product.longitud,
            product.quantity,
            product.MinimumQuantity,
            product.imagen,
            product.Precio,
            product.Discount,
            product.userId,
            new Date()
        ];
        console.log("📦 Valores que se enviarán al INSERT:", productValues);
        await db.query(ProductSql, productValues);
    }

    static async restoreQuantity(id_producto: number, cantidad: number) {
        const sql = `
            UPDATE producto
            SET cantidad = cantidad + ?
            WHERE id_producto = ?
        `;
        const values = [cantidad, id_producto];
        const result = await db.query(sql, values);
        return result;
    }

    static async deleteProductsBySeller(id_user: number) {
        const sql = `
        UPDATE producto
        SET eliminado = true
        WHERE id_vendedor = ?
        `;
        const result = await db.query(sql, [id_user]);
        return result;
    }

    static async editQuantity(id_producto: number, cantidad: number) {
        const sql = `
            UPDATE producto
            SET cantidad = cantidad - ?
            WHERE id_producto = ?
        `;
        const values = [cantidad, id_producto];
        const result = await db.query(sql, values);
        return result;
    }

    static async buy(id_vendedor: number, id_producto: number, id_user: number, cantidad: number, latitud: number, longitud: number, precio_unidad: number) {
        const sql = `
            INSERT INTO compra (id_producto, id_comprador, cantidad, fecha_compra, id_vendedor, estado, latitud_comprador, longitud_comprador, precio_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [id_producto, id_user, cantidad, new Date(), id_vendedor, "Pendiente", latitud, longitud, precio_unidad];
        const result = await db.query(sql, values);
        return result;
    }

    static async findById(id: number) {
        const checkSql = `SELECT * FROM producto WHERE id_producto = ? AND (despublicado = false OR eliminado = false)`;
        const { rows: result } = await db.query(checkSql, [id]);
        return result.length ? result[0] : null;
    }

    static async update(id: number, productData: Product) {
        const updateSql = `
            UPDATE producto 
            SET precio_unidad = ?, descripcion = ?, latitud = ?, longitud = ?, 
                cantidad = ?, cantidad_minima_compra = ?, imagen = ?, descuento = ?
            WHERE id_producto = ?
        `;
        const values = [productData.Precio, productData.Description, productData.latitud, productData.longitud,
        productData.quantity, productData.MinimumQuantity, productData.imagen, productData.Discount]
        await db.query(updateSql, [...values, id]);
    }

    static async getAll() {
        const sql = `
        SELECT 
            p.*, 
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.despublicado = false AND p.eliminado = false
        `;
        const products = await db.query(sql);
        return products.rows;
    }

    static async getAllAdmin() {
        const sql = `
        SELECT 
            p.*, 
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        `;
        const products = await db.query(sql);
        return products.rows;
    }

    static async get(id_product: number) {
        const sql = `
        SELECT 
            p.*, 
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.id_producto = ? AND (p.despublicado = false OR p.eliminado = false)
        `;
        const product = await db.query(sql, [id_product]);
        return product.rows;
    }

    static async getWithDiscount() {
        const sql = `
        SELECT 
            p.*,
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.descuento > 0 AND (p.despublicado = false OR p.eliminado = false)
        ORDER BY p.descuento DESC
        `;
        const products = await db.query(sql);
        return products.rows;
    }

    static async getBySeller(id_user: number) {
        const sql = `
        SELECT 
            p.*,
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario 
        WHERE p.id_vendedor = ? AND p.eliminado = false
        `;
        const products = await db.query(sql, [id_user]);
        return products.rows;
    }

    // Obtener el vendedor de un producto específico
    static async findProductOwner(productId: number) {
        const query = `SELECT id_vendedor FROM producto WHERE id_producto = ? AND eliminado = false`;
        const { rows: result } = await db.query(query, [productId]);
        return result.length ? result[0].id_vendedor : null;
    }

    // Eliminar el producto si el vendedor es el dueño
    static async deleteProduct(productId: number) {
        const query = `
        UPDATE producto
        SET eliminado = true
        WHERE id_producto = ?`;
        const { rowCount } = await db.query(query, [productId]);
        return rowCount;
    }

    static async unpublishProduct(id_producto: number) {
        const query = `
        UPDATE producto
        SET despublicado = true
        WHERE id_producto = ?
        `;
        const { rowCount } = await db.query(query, [id_producto]);
        return rowCount;
    }
    static async publishProduct(id_producto: number) {
        const query = `
        UPDATE producto
        SET despublicado = false
        WHERE id_producto = ?
        `;
        const rowCount = await db.query(query, [id_producto]);
        return rowCount;
    }
}

export default ProductRepository;
