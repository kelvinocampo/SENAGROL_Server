import supabase from "../Config/configDB";

export type TypeOwner = "transportador" | "comprador" | "vendedor";

// Helper function to enrich buy data with related information
async function enrichBuyData(compras: any[]) {
    return await Promise.all(compras.map(async (c) => {
        // Obtener producto
        const { data: producto } = await supabase
            .from('producto')
            .select('id_producto, nombre')
            .eq('id_producto', c.id_producto)
            .maybeSingle();

        // Obtener vendedor y su usuario
        let vendedor_nombre = c.nombre_vendedor_eliminado;
        if (c.id_vendedor) {
            const { data: usuario } = await supabase
                .from('usuario')
                .select('nombre')
                .eq('id_usuario', c.id_vendedor)
                .maybeSingle();
            if (usuario) vendedor_nombre = usuario.nombre;
        }

        // Obtener comprador y su usuario
        let comprador_nombre = c.nombre_comprador_eliminado;
        if (c.id_comprador) {
            const { data: usuario } = await supabase
                .from('usuario')
                .select('nombre')
                .eq('id_usuario', c.id_comprador)
                .maybeSingle();
            if (usuario) comprador_nombre = usuario.nombre;
        }

        // Obtener transportador y su usuario
        let transportador_nombre = c.nombre_transportador_eliminado;
        if (c.id_transportador) {
            const { data: usuario } = await supabase
                .from('usuario')
                .select('nombre')
                .eq('id_usuario', c.id_transportador)
                .maybeSingle();
            if (usuario) transportador_nombre = usuario.nombre;
        }

        return {
            id_compra: c.id_compra,
            estado: c.estado,
            precio_transporte: c.precio_transporte,
            precio_producto: c.precio_producto,
            cantidad: c.cantidad,
            fecha_compra: c.fecha_compra,
            fecha_entrega: c.fecha_entrega,
            producto_id: producto?.id_producto,
            producto_nombre: producto?.nombre,
            vendedor_id: c.id_vendedor,
            vendedor_nombre,
            comprador_id: c.id_comprador,
            comprador_nombre,
            transportador_id: c.id_transportador,
            transportador_nombre
        };
    }));
}

class BuyRepository {
    static async getByOwner(id_user: number, typeOwner: TypeOwner) {
        let filterField = '';
        if (typeOwner === "transportador") filterField = 'id_transportador';
        else if (typeOwner === "comprador") filterField = 'id_comprador';
        else if (typeOwner === "vendedor") filterField = 'id_vendedor';

        const { data: compras, error } = await supabase
            .from('compra')
            .select('*')
            .eq(filterField, id_user);

        if (error) {
            console.error('Error getting buys by owner:', error);
            throw error;
        }

        if (!compras) return [];

        return await enrichBuyData(compras);
    }

    static async setNameDeletedUser(id_user: number, typeOwner: TypeOwner, name: string) {
        const updateField = `nombre_${typeOwner}_eliminado`;
        const idField = `id_${typeOwner}`;

        const { data, error } = await supabase
            .from('compra')
            .update({ [updateField]: name })
            .eq(idField, id_user)
            .is(updateField, null)
            .select();

        if (error) {
            console.error('Error setting deleted user name:', error);
            throw error;
        }

        return data;
    }

    static async updateToPendingBuys(id_user: number) {
        const { data, error } = await supabase
            .from('compra')
            .update({
                estado: 'Pendiente',
                precio_transporte: null,
                id_transportador: null
            })
            .eq('id_transportador', id_user)
            .eq('estado', 'Asignada')
            .select();

        if (error) {
            console.error('Error updating to pending buys:', error);
            throw error;
        }

        return data;
    }

    static async deleteBuysPending(id_user: number) {
        const { data, error } = await supabase
            .from('compra')
            .delete()
            .eq('id_vendedor', id_user)
            .eq('estado', 'Pendiente')
            .select();

        if (error) {
            console.error('Error deleting pending buys:', error);
            throw error;
        }

        return data;
    }

    static async getAllByUserId(id_user: number) {
        const { data: compras, error } = await supabase
            .from('compra')
            .select('*')
            .or(`id_comprador.eq.${id_user},id_vendedor.eq.${id_user},id_transportador.eq.${id_user}`);

        if (error) {
            console.error('Error getting all buys by user:', error);
            throw error;
        }

        if (!compras) return [];

        return await enrichBuyData(compras);
    }

    static async findByProduct(id_producto: number) {
        const { data: compras, error } = await supabase
            .from('compra')
            .select('*')
            .eq('id_producto', id_producto);

        if (error) {
            console.error('Error finding buys by product:', error);
            throw error;
        }

        if (!compras) return [];

        return await enrichBuyData(compras);
    }

    static async assignTransporter(id_user: number, id_compra: number, id_transportador: number, precio_transporte: number) {
        const { data, error } = await supabase
            .from('compra')
            .update({
                id_transportador,
                estado: 'Asignada',
                precio_transporte
            })
            .eq('id_compra', id_compra)
            .select();

        if (error) {
            console.error('Error assigning transporter:', error);
            throw error;
        }

        return data;
    }

    static async generateCode(id_compra: number, id_user: number) {
        const { data, error } = await supabase
            .from('compra')
            .select('estado, id_compra')
            .eq('id_compra', id_compra)
            .or(`id_comprador.eq.${id_user},id_vendedor.eq.${id_user}`);

        if (error) {
            console.error('Error generating code:', error);
            throw error;
        }

        return data || [];
    }

    static async receiveCodeBuy(id_compra: number, estado: string, id_user: number) {
        const updateObj: any = { estado };

        if (estado === "Entregada") {
            updateObj.fecha_entrega = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from('compra')
            .update(updateObj)
            .eq('id_compra', id_compra)
            .eq('id_transportador', id_user)
            .select();

        if (error) {
            console.error('Error receiving code buy:', error);
            throw error;
        }

        return data;
    }

    static async getAllAdmin() {
        const { data: compras, error } = await supabase
            .from('compra')
            .select('*');

        if (error) {
            console.error('Error getting all buys for admin:', error);
            throw error;
        }

        if (!compras) return [];

        return await enrichBuyData(compras);
    }

    static async getById(id_compra: number) {
        const { data: compras, error } = await supabase
            .from('compra')
            .select('*')
            .eq('id_compra', id_compra);

        if (error) {
            console.error('Error getting buy by id:', error);
            throw error;
        }

        if (!compras) return [];

        return await enrichBuyData(compras);
    }

    static async cancelTransport(id_user: number, id_compra: number) {
        const { data, error } = await supabase
            .from('compra')
            .update({
                id_transportador: null,
                precio_transporte: null,
                estado: 'Pendiente'
            })
            .eq('id_compra', id_compra)
            .eq('estado', 'Asignada')
            .or(`id_comprador.eq.${id_user},id_transportador.eq.${id_user}`)
            .select();

        if (error) {
            console.error('Error canceling transport:', error);
            throw error;
        }

        return data;
    }

    static async getLocation(id_user: number, id_compra: number) {
        // Obtener compra
        const { data: compra, error: compraError } = await supabase
            .from('compra')
            .select('latitud_comprador, longitud_comprador, id_producto')
            .eq('id_compra', id_compra)
            .or(`id_comprador.eq.${id_user},id_transportador.eq.${id_user}`)
            .single();

        if (compraError || !compra) {
            console.error('Error getting location:', compraError);
            return [];
        }

        // Obtener producto
        const { data: producto } = await supabase
            .from('producto')
            .select('latitud, longitud')
            .eq('id_producto', compra.id_producto)
            .single();

        return [{
            latitud_comprador: compra.latitud_comprador,
            longitud_comprador: compra.longitud_comprador,
            latitud: producto?.latitud,
            longitud: producto?.longitud
        }];
    }
}

export default BuyRepository;