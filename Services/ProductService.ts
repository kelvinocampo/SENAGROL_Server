import Product from "../Dto/Product/ProductsCreate";
import { deleteFromAzure } from "../Helpers/DeleteFile";
import BuyRepository from "../Repositories/BuyRepository";
import ProductRepository from "../Repositories/ProductRepository";

class ProductService {
    //  Registrar un nuevo producto
    static async register(product: Product) {
        try {
            // Si es vendedor, proceder con la creación del producto
            await ProductRepository.createProduct(product);
            return { success: true, message: "Producto registrado exitosamente." };

        } catch (error) {
            console.error("Error en ProductService.register:", error);
            return { success: false, message: "Error interno del servidor." };
        }
    }

    static async buy(id_producto: number, id_user: number, cantidad: number, latitud: number, longitud: number) {
        try {
            // Verificar si el producto existe
            const existingProduct = await ProductRepository.findById(id_producto);
            if (!existingProduct) {
                return { success: false, message: "Producto no encontrado" };
            }

            // Verificar si la cantidad solicitada es válida
            if (cantidad <= 0 || cantidad > existingProduct.cantidad || cantidad < existingProduct.cantidad_minima_compra) {
                return { success: false, message: "Cantidad no válida" };
            }
            const editQuantity = await ProductRepository.editQuantity(id_producto, cantidad);
            if (!editQuantity) {
                return { success: false, message: "Error al actualizar la cantidad del producto" };
            }
            const result = await ProductRepository.buy(existingProduct.id_vendedor, id_producto, id_user, cantidad, latitud, longitud, (existingProduct.precio_unidad * cantidad));
            if (!result) {
                return { success: false, message: "Error al realizar la compra" };
            }

            return { success: true, message: "Compra realizada exitosamente." };
        } catch (error) {
            console.error("Error en ProductService.buy:", error);
            return { success: false, message: "Error interno del servidor." };
        }
    }

    // Obtener todos los productos
    static async getAll() {
        return await ProductRepository.getAll();
    }

    static async get(id_product: number) {
        return await ProductRepository.get(id_product);
    }

    static async getWithDiscount() {
        return await ProductRepository.getWithDiscount();
    }

    static async getBySeller(id_user: number) {
        return await ProductRepository.getBySeller(id_user);
    }

    // Actualizar producto
    static async updateProduct(id: number, productData: Product) {
        try {
            console.log(productData);

            const existingProduct = await ProductRepository.findById(id);
            if (!existingProduct) {
                return { success: false, message: "Producto no encontrado" };
            }

            await deleteFromAzure(existingProduct.imagen, "producto");

            await ProductRepository.update(id, productData);
            return { success: true, message: "Producto actualizado correctamente." };
        } catch (error) {
            console.error("Error en ProductService.updateProduct:", error);
            return { success: false, message: "Error interno del servidor." };
        }
    }

    static async deleteProduct(userId: number, productId: number) {
        // Verificar si el producto existe y pertenece al vendedor
        const productOwner = await ProductRepository.findProductOwner(productId);
        const existingProduct = await ProductRepository.findById(productId);
        if (!existingProduct || !productOwner) {
            return { success: false, message: "Producto no encontrado" };
        }

        if (productOwner !== userId) {
            return { success: false, message: "No puedes eliminar un producto que no te pertenece." };
        }

        await deleteFromAzure(existingProduct.imagen, "producto");

        // Eliminar el producto
        await ProductRepository.deleteProduct(productId);
        return { success: true, message: "Producto eliminado correctamente." };
    }

    static async deleteProductAdmin(productId: number) {
        // Verificar si el producto existe y pertenece al vendedor
        const existingProduct = await ProductRepository.findById(productId);
        if (!existingProduct) {
            return { success: false, message: "Producto no encontrado" };
        }

        await deleteFromAzure(existingProduct.imagen, "producto");

        // Eliminar el producto
        await ProductRepository.deleteProduct(productId);
        return { success: true, message: "Producto eliminado correctamente." };
    }
}





export default ProductService;
