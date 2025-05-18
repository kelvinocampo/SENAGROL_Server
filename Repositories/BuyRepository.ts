import db from "../Config/configDB";

type TypeOwner = "transportador" | "comprador" | "vendedor";

class BuyRepository {
    static async getByOwner(id_user: number, typeOwner: TypeOwner) {
        let whereSentence = "WHERE "
        if (typeOwner === "transportador") whereSentence += "c.id_transportador = ?"
        else if (typeOwner === "comprador") whereSentence += "c.id_comprador = ?"
        else if (typeOwner === "vendedor") whereSentence += "c.id_vendedor = ?"

        const query = `
        SELECT 
            c.id_compra,
            c.estado,
            c.precio_transporte,
            c.precio_producto,
            c.cantidad,
            c.fecha_compra,
            c.fecha_entrega,
            
            p.id_producto AS producto_id,
            p.nombre AS producto_nombre,
            
            v.id_vendedor AS vendedor_id,
            uv.nombre AS vendedor_nombre,
            
            co.id_comprador AS comprador_id,
            uc.nombre AS comprador_nombre,
            
            t.id_transportador AS transportador_id,
            ut.nombre AS transportador_nombre
        FROM 
            compra c
        LEFT JOIN 
            producto p ON c.id_producto = p.id_producto
        LEFT JOIN 
            vendedor v ON c.id_vendedor = v.id_vendedor
        LEFT JOIN 
            usuario uv ON v.id_vendedor = uv.id_usuario
        LEFT JOIN 
            comprador co ON c.id_comprador = co.id_comprador
        LEFT JOIN 
            usuario uc ON co.id_comprador = uc.id_usuario
        LEFT JOIN 
            transportador t ON c.id_transportador = t.id_transportador
        LEFT JOIN 
            usuario ut ON t.id_transportador = ut.id_usuario
        ${whereSentence}
        `;
        const [result]: any = await db.execute(query, [id_user])
        return result;
    }

    static async setNameDeletedUser(id_user: number, typeOwner: TypeOwner, name: string) {
        const query = `
        UPDATE compra c
        SET nombre_${typeOwner}_eliminado = ?
        WHERE c.id_${typeOwner} = ? AND c.nombre_${typeOwner}_eliminado IS NULL
        `;
        const [result]: any = await db.execute(query, [name, id_user])
        return result;
    }

    static async updateToPendingBuys(id_user: number) {
        const query = `
        UPDATE compra
        SET estado = 'Pendiente', precio_transporte = NULL, id_transportador = NULL

        WHERE c.id_transportador = ? AND estado = 'Asignada'
        `;
        const [result]: any = await db.execute(query, [id_user, id_user])
        return result;
    }

    static async deleteBuysPending(id_user: number) {
        const query = `
        DELETE FROM compra
        WHERE id_vendedor = ? AND estado = 'Pendiente'
        `;
        const [result]: any = await db.execute(query, [id_user, id_user])
        return result;
    }

    static async getAllByUserId(id_user: number) {
        const query = `
        SELECT 
            c.id_compra,
            c.estado,
            c.precio_transporte,
            c.precio_producto,
            c.cantidad,
            c.fecha_compra,
            c.fecha_entrega,
            
            p.id_producto AS producto_id,
            p.nombre AS producto_nombre,
            
            v.id_vendedor AS vendedor_id,
            uv.nombre AS vendedor_nombre,
            
            co.id_comprador AS comprador_id,
            uc.nombre AS comprador_nombre,
            
            t.id_transportador AS transportador_id,
            ut.nombre AS transportador_nombre
        FROM
            compra c
        LEFT JOIN
            producto p ON c.id_producto = p.id_producto
        LEFT JOIN
            vendedor v ON c.id_vendedor = v.id_vendedor
        LEFT JOIN
            usuario uv ON v.id_vendedor = uv.id_usuario
        LEFT JOIN
            comprador co ON c.id_comprador = co.id_comprador
        LEFT JOIN
            usuario uc ON co.id_comprador = uc.id_usuario
        LEFT JOIN
            transportador t ON c.id_transportador = t.id_transportador
        LEFT JOIN
            usuario ut ON t.id_transportador = ut.id_usuario
        WHERE
            c.id_comprador = ? OR c.id_vendedor = ? OR c.id_transportador = ?
        `;
        const [result]: any = await db.execute(query, [id_user, id_user, id_user])
        return result;
    }

    static async findByProduct(id_producto: number) {
        const query = `
        SELECT 
            c.id_compra,
            c.estado,
            c.precio_transporte,
            c.precio_producto,
            c.cantidad,
            c.fecha_compra,
            c.fecha_entrega,
            
            p.id_producto AS producto_id,
            p.nombre AS producto_nombre,
            
            v.id_vendedor AS vendedor_id,
            uv.nombre AS vendedor_nombre,
            
            co.id_comprador AS comprador_id,
            uc.nombre AS comprador_nombre,
            
            t.id_transportador AS transportador_id,
            ut.nombre AS transportador_nombre
        FROM
            compra c
        LEFT JOIN
            producto p ON c.id_producto = p.id_producto
        LEFT JOIN
            vendedor v ON c.id_vendedor = v.id_vendedor
        LEFT JOIN
            usuario uv ON v.id_vendedor = uv.id_usuario
        LEFT JOIN
            comprador co ON c.id_comprador = co.id_comprador
        LEFT JOIN
            usuario uc ON co.id_comprador = uc.id_usuario
        LEFT JOIN
            transportador t ON c.id_transportador = t.id_transportador
        LEFT JOIN
            usuario ut ON t.id_transportador = ut.id_usuario
        WHERE
            c.id_producto = ?
        `;
        const [result]: any = await db.execute(query, [id_producto])
        return result;
    }

    static async assignTransporter(id_user: number, id_compra: number, id_transportador: number, precio_transporte: number) {
        const query = `
        UPDATE compra
        SET id_transportador = ?, estado = ?, precio_transporte = ?
            WHERE id_compra = ?
                `
        const [result]: any = await db.execute(query, [id_transportador, "Asignada", id_compra])
        return result;
    }

    static async generateCode(id_compra: number, id_user: number) {
        const query = `
        SELECT estado, id_compra
        FROM compra
        WHERE id_compra = ? AND(id_comprador = ? OR id_vendedor = ?)
            `
        const [result]: any = await db.execute(query, [id_compra, id_user, id_user])
        return result;
    }

    static async receiveCodeBuy(id_compra: number, estado: string, id_user: number) {
        const query = `
        UPDATE compra
        SET estado = ?
        WHERE id_compra = ? AND (id_comprador = ? OR id_vendedor = ?)
        `
        const [result]: any = await db.execute(query, [estado, id_compra, id_user, id_user])
        return result;
    }

    static async getAllAdmin() {
        const query = `
        SELECT
        c.id_compra,
            c.estado,
            c.precio_transporte,
            c.precio_producto,
            c.cantidad,
            c.fecha_compra,
            c.fecha_entrega,

            p.id_producto AS producto_id,
                p.nombre AS producto_nombre,

                    v.id_vendedor AS vendedor_id,
                        uv.nombre AS vendedor_nombre,

                            co.id_comprador AS comprador_id,
                                uc.nombre AS comprador_nombre,

                                    t.id_transportador AS transportador_id,
                                        ut.nombre AS transportador_nombre
        FROM 
            compra c
        LEFT JOIN 
            producto p ON c.id_producto = p.id_producto
        LEFT JOIN 
            vendedor v ON c.id_vendedor = v.id_vendedor
        LEFT JOIN 
            usuario uv ON v.id_vendedor = uv.id_usuario
        LEFT JOIN 
            comprador co ON c.id_comprador = co.id_comprador
        LEFT JOIN 
            usuario uc ON co.id_comprador = uc.id_usuario
        LEFT JOIN 
            transportador t ON c.id_transportador = t.id_transportador
        LEFT JOIN 
            usuario ut ON t.id_transportador = ut.id_usuario
            `;
        const [result]: any = await db.execute(query)
        return result;
    }
}

export default BuyRepository;