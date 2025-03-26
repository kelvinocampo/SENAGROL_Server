import db from '../config/configDB';
import Product from '../Dto/Products/ProductsCreate';

class ProductRepository {
    static async findSellerById(userId: number) {
        const checkVendedor = `SELECT * FROM vendedor WHERE id_vendedor = ?`;
        const [vendedorExistente]: any = await db.execute(checkVendedor, [userId]);
        return vendedorExistente.length ? vendedorExistente[0] : null;
    }

    static async createProduct(product: Product) {
        const ProductSql = `
            INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [
            product.Nombre,
            product.Description,
            product.latitud || null,
            product.longitud || null,
            product.quantity || 0,
            product.MinimumQuantity || 0,
            product.imagen || null,
            product.Precio || 0,
            product.Discount || 0,
            product.userId || null
        ];

        await db.execute(ProductSql, productValues);
    }
    

    static async findById(id: number) {
        const checkSql = `SELECT * FROM producto WHERE id_producto = ?`;
        const [result]: any = await db.execute(checkSql, [id]);
        return result.length ? result[0] : null;
    }

    static async update(id: number, values: any[]) {
        const updateSql = `
            UPDATE producto 
            SET nombre = ?, precio_unidad = ?, descripcion = ?, latitud = ?, longitud = ?, 
                cantidad = ?, cantidad_minima_compra = ?, imagen = ?, descuento = ?
            WHERE id_producto = ?
        `;
        await db.execute(updateSql, [...values, id]);
    }




}

export default ProductRepository;
