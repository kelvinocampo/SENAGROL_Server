import db from '../Config/configDB';
import Product from '../Dto/Product/ProductsCreate';

class ProductRepository {
    static async findSellerById(userId: number) {
        const checkVendedor = `SELECT * FROM vendedor WHERE id_vendedor = ?`;
        const [vendedorExistente]: any = await db.execute(checkVendedor, [userId]);
        return vendedorExistente.length ? vendedorExistente[0] : null;
    }

    static async createProduct(product: Product) {
        // Verificar si el usuario es un vendedor antes de registrar el producto
        const vendedor = await this.findSellerById(product.userId);
        if (!vendedor) {
            throw new Error("Acceso denegado. Solo los vendedores pueden registrar productos.");
        }

        const ProductSql = `
            INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            product.userId
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
    static async getAll() {
        const sql = "SELECT * FROM producto";
        const [products]: any = await db.execute(sql);
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
    
}

export default ProductRepository;
