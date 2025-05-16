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

        await db.execute(ProductSql, productValues);
    }

    static async editQuantity(id_producto: number, cantidad: number) {
        const sql = `
            UPDATE producto
            SET cantidad = cantidad - ?
            WHERE id_producto = ?
        `;
        const values = [cantidad, id_producto];
        const [result]: any = await db.execute(sql, values);
        return result;
    }

    static async buy(id_vendedor: number, id_producto: number, id_user: number, cantidad: number) {
        const sql = `
            INSERT INTO compra (id_producto, id_comprador, cantidad, fecha_compra, id_vendedor, estado)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [id_producto, id_user, cantidad, new Date(), id_vendedor, "Pendiente"];
        const [result]: any = await db.execute(sql, values);
        return result;
    }

    static async findById(id: number) {
        const checkSql = `SELECT * FROM producto WHERE id_producto = ?`;
        const [result]: any = await db.execute(checkSql, [id]);
        return result.length ? result[0] : null;
    }

    static async update(id: number, productData: Product) {
        const updateSql = `
            UPDATE producto 
            SET nombre = ?, precio_unidad = ?, descripcion = ?, latitud = ?, longitud = ?, 
                cantidad = ?, cantidad_minima_compra = ?, imagen = ?, descuento = ?
            WHERE id_producto = ?
        `;
        const values = [productData.Nombre, productData.Precio, productData.Description, productData.latitud, productData.longitud,
        productData.quantity, productData.MinimumQuantity, productData.imagen, productData.Discount]
        await db.execute(updateSql, [...values, id]);
    }

    static async getAll() {
        const sql = `
        SELECT 
            p.*, 
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.despublicado = 0
        `;
        const [products]: any = await db.execute(sql);
        return products;
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
        const [products]: any = await db.execute(sql);
        return products;
    }

    static async get(id_product: number) {
        const sql = `
        SELECT 
            p.*, 
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.id_producto = ? AND p.despublicado = 0
        `;
        const [product]: any = await db.execute(sql, [id_product]);
        return product;
    }

    static async getWithDiscount() {
        const sql = `
        SELECT 
            p.*,
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario
        WHERE p.descuento > 0 AND p.despublicado = 0
        ORDER BY p.descuento DESC
        `;
        const [products]: any = await db.execute(sql);
        return products;
    }

    static async getBySeller(id_user: number) {
        const sql = `
        SELECT 
            p.*,
            u.nombre AS nombre_vendedor
        FROM producto p
        JOIN vendedor v ON p.id_vendedor = v.id_vendedor
        JOIN usuario u ON v.id_vendedor = u.id_usuario 
        WHERE p.id_vendedor = ?
        `;
        const [products]: any = await db.execute(sql, [id_user]);
        return products;
    }

    // Obtener el vendedor de un producto específico
    static async findProductOwner(productId: number) {
        const query = `SELECT id_vendedor FROM producto WHERE id_producto = ?`;
        const [result]: any = await db.execute(query, [productId]);
        return result.length ? result[0].id_vendedor : null;
    }

    // Eliminar el producto si el vendedor es el dueño
    static async deleteProduct(productId: number) {
        const query = `DELETE FROM producto WHERE id_producto = ?`;
        const [result]: any = await db.execute(query, [productId]);
        return result;
    }

    static async unpublishProduct(id_producto: number) {
        const query = `
        UPDATE producto
        SET despublicado = 1
        WHERE id_producto = ?
        `;
        const [result]: any = await db.execute(query, [id_producto]);
        return result;
    }
    static async publishProduct(id_producto: number) {
        const query = `
        UPDATE producto
        SET despublicado = 0
        WHERE id_producto = ?
        `;
        const [result]: any = await db.execute(query, [id_producto]);
        return result;
    }
}

export default ProductRepository;
