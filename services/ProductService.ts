import db from '../config/configDB';
import Product from '../Dto/Products/ProductsCreate';
import UserDto from '../Dto/UserDto';
import generateHash from '../Helpers/generateHash';

class ProductService { 
    static async register(product: Product) {
        // 1. Verificar si el usuario ya es vendedor
        const checkVendedor = `SELECT * FROM vendedor WHERE id_vendedor = ?`;
        const [vendedorExistente]: any = await db.execute(checkVendedor, [product.userId]);
        
        if (vendedorExistente.length === 0) {
            throw new Error("El vendedor no está registrado.");
        }
        

        // 2. Insertar en la tabla de productos
        const ProductSql = `
            INSERT INTO producto ( nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor)
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            
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
}

export default ProductService;

