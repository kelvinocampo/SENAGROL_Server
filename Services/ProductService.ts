import Product from "../Dto/Product/ProductsCreate";
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

            // await removeFile(existingProduct.imagen);

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
        if (!productOwner) {
            throw new Error("Producto no encontrado.");
        }

        if (productOwner !== userId) {
            throw new Error("No puedes eliminar un producto que no te pertenece.");
        }

        // Eliminar el producto
        await ProductRepository.deleteProduct(productId);
        return { success: true, message: "Producto eliminado correctamente." };
    }
}





export default ProductService;
