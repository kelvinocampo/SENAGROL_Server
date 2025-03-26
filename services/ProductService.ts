import db from "../config/configDB";
import Product from "../Dto/Products/ProductsCreate";
import ProductRepository from "../repositories/PruductRepository"


class ProductService { 

    //  Registrar un nuevo producto
    static async register(product: Product) {
        const checkVendedor = `SELECT * FROM vendedor WHERE id_vendedor = ?`;
        const [vendedorExistente]: any = await db.execute(checkVendedor, [product.userId]);

        if (vendedorExistente.length === 0) {
            throw new Error("El vendedor no está registrado.");
        }

        const sql = `
            INSERT INTO producto (nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            product.Nombre, 
            product.Description,
            product.latitud || null, 
            product.longitud || null,
            product.quantity || 0,
            product.MinimumQuantity || 0,
            product.imagen || null,
            product.Precio || 0, 
            product.Discount || 0,
            product.userId
        ];

        await db.execute(sql, values);
    }

    //   todos los productos
    static async getAll() {
        const sql = "SELECT * FROM producto";
        const [products]: any = await db.execute(sql);
        return products;
    }

    


    //  Actualizar un producto 
    

 
    
        static async updateProduct(id: number, productData: any) {
            const existingProduct = await ProductRepository.findById(id);
            if (!existingProduct) {
                throw new Error("Producto no encontrado");
            }
    
            const { Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagen, Discount } = productData;
    
            if (!Nombre || !Precio || !latitud || !longitud || !quantity || !MinimumQuantity || Discount === undefined) {
                throw new Error("Todos los campos son obligatorios para una actualización completa.");
            }
    
            const values = [Nombre, Precio, Description, latitud, longitud, quantity, MinimumQuantity, imagen, Discount];
            await ProductRepository.update(id, values);
        }
    
    
    
    

    //  Eliminar un producto
    static async delete(productId: number) {
        const sql = "DELETE FROM producto WHERE id_producto = ?";
        await db.execute(sql, [productId]);
    }
}

export default ProductService;
