import supabase from '../Config/configDB';
import Product from '../Dto/Product/ProductsCreate';

class ProductRepository {

    static async createProduct(product: Product) {
        const { error } = await supabase
            .from('producto')
            .insert({
                nombre: product.Nombre,
                descripcion: product.Description,
                latitud: product.latitud,
                longitud: product.longitud,
                cantidad: product.quantity,
                cantidad_minima_compra: product.MinimumQuantity,
                imagen: product.imagen,
                precio_unidad: product.Precio,
                descuento: product.Discount,
                id_vendedor: product.userId,
                fecha_publicacion: new Date().toISOString()
            });

        if (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static async restoreQuantity(id_producto: number, cantidad: number) {
        // Primero obtener la cantidad actual
        const { data: currentProduct } = await supabase
            .from('producto')
            .select('cantidad')
            .eq('id_producto', id_producto)
            .single();

        if (!currentProduct) {
            throw new Error('Product not found');
        }

        const { data, error } = await supabase
            .from('producto')
            .update({ cantidad: currentProduct.cantidad + cantidad })
            .eq('id_producto', id_producto)
            .select();

        if (error) {
            console.error('Error restoring quantity:', error);
            throw error;
        }

        return data;
    }

    static async deleteProductsBySeller(id_user: number) {
        const { data, error } = await supabase
            .from('producto')
            .update({ eliminado: true })
            .eq('id_vendedor', id_user)
            .select();

        if (error) {
            console.error('Error deleting products by seller:', error);
            throw error;
        }

        return data;
    }

    static async editQuantity(id_producto: number, cantidad: number) {
        // Primero obtener la cantidad actual
        const { data: currentProduct } = await supabase
            .from('producto')
            .select('cantidad')
            .eq('id_producto', id_producto)
            .single();

        if (!currentProduct) {
            throw new Error('Product not found');
        }

        const { data, error } = await supabase
            .from('producto')
            .update({ cantidad: currentProduct.cantidad - cantidad })
            .eq('id_producto', id_producto)
            .select();

        if (error) {
            console.error('Error editing quantity:', error);
            throw error;
        }

        return data;
    }

    static async buy(id_vendedor: number, id_producto: number, id_user: number, cantidad: number, latitud: number, longitud: number, precio_unidad: number) {
        const { data, error } = await supabase
            .from('compra')
            .insert({
                id_producto,
                id_comprador: id_user,
                cantidad,
                fecha_compra: new Date().toISOString(),
                id_vendedor,
                estado: "Pendiente",
                latitud_comprador: latitud,
                longitud_comprador: longitud,
                precio_producto: precio_unidad
            })
            .select();

        if (error) {
            console.error('Error creating buy:', error);
            throw error;
        }

        return data;
    }

    static async findById(id: number) {
        const { data, error } = await supabase
            .from('producto')
            .select('*')
            .eq('id_producto', id)
            .eq('despublicado', false)
            .eq('eliminado', false)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error finding product by id:', error);
            return null;
        }

        return data;
    }

    static async update(id: number, productData: Product) {
        const { error } = await supabase
            .from('producto')
            .update({
                precio_unidad: productData.Precio,
                descripcion: productData.Description,
                latitud: productData.latitud,
                longitud: productData.longitud,
                cantidad: productData.quantity,
                cantidad_minima_compra: productData.MinimumQuantity,
                imagen: productData.imagen,
                descuento: productData.Discount
            })
            .eq('id_producto', id);

        if (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async getAll() {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                vendedor!inner(id_vendedor, usuario!inner(nombre))
            `)
            .eq('despublicado', false)
            .eq('eliminado', false);

        if (error) {
            console.error('Error getting all products:', error);
            throw error;
        }

        // Formatear respuesta para mantener compatibilidad
        const products = data?.map(p => ({
            ...p,
            nombre_vendedor: p.vendedor?.usuario?.nombre
        })) || [];

        return products;
    }

    static async getAllAdmin() {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                vendedor!inner(id_vendedor, usuario!inner(nombre))
            `);

        if (error) {
            console.error('Error getting all products for admin:', error);
            throw error;
        }

        // Formatear respuesta para mantener compatibilidad
        const products = data?.map(p => ({
            ...p,
            nombre_vendedor: p.vendedor?.usuario?.nombre
        })) || [];

        return products;
    }

    static async get(id_product: number) {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                vendedor!inner(id_vendedor, usuario!inner(nombre))
            `)
            .eq('id_producto', id_product)
            .or('despublicado.eq.false,eliminado.eq.false')
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error getting product:', error);
            return [];
        }

        if (!data) return [];

        return [{
            ...data,
            nombre_vendedor: data.vendedor?.usuario?.nombre
        }];
    }

    static async getWithDiscount() {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                vendedor!inner(id_vendedor, usuario!inner(nombre))
            `)
            .gt('descuento', 0)
            .or('despublicado.eq.false,eliminado.eq.false')
            .order('descuento', { ascending: false });

        if (error) {
            console.error('Error getting products with discount:', error);
            throw error;
        }

        // Formatear respuesta para mantener compatibilidad
        const products = data?.map(p => ({
            ...p,
            nombre_vendedor: p.vendedor?.usuario?.nombre
        })) || [];

        return products;
    }

    static async getBySeller(id_user: number) {
        const { data, error } = await supabase
            .from('producto')
            .select(`
                *,
                vendedor!inner(id_vendedor, usuario!inner(nombre))
            `)
            .eq('id_vendedor', id_user)
            .eq('eliminado', false);

        if (error) {
            console.error('Error getting products by seller:', error);
            throw error;
        }

        // Formatear respuesta para mantener compatibilidad
        const products = data?.map(p => ({
            ...p,
            nombre_vendedor: p.vendedor?.usuario?.nombre
        })) || [];

        return products;
    }

    // Obtener el vendedor de un producto específico
    static async findProductOwner(productId: number) {
        const { data, error } = await supabase
            .from('producto')
            .select('id_vendedor')
            .eq('id_producto', productId)
            .eq('eliminado', false)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error finding product owner:', error);
            return null;
        }

        return data?.id_vendedor || null;
    }

    // Eliminar el producto si el vendedor es el dueño
    static async deleteProduct(productId: number) {
        const { data, error } = await supabase
            .from('producto')
            .update({ eliminado: true })
            .eq('id_producto', productId)
            .select();

        if (error) {
            console.error('Error deleting product:', error);
            throw error;
        }

        return data?.length || 0;
    }

    static async unpublishProduct(id_producto: number) {
        const { data, error } = await supabase
            .from('producto')
            .update({ despublicado: true })
            .eq('id_producto', id_producto)
            .select();

        if (error) {
            console.error('Error unpublishing product:', error);
            throw error;
        }

        return data?.length || 0;
    }

    static async publishProduct(id_producto: number) {
        const { data, error } = await supabase
            .from('producto')
            .update({ despublicado: false })
            .eq('id_producto', id_producto)
            .select();

        if (error) {
            console.error('Error publishing product:', error);
            throw error;
        }

        return data?.length || 0;
    }
}

export default ProductRepository;
