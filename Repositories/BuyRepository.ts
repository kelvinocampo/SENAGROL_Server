import db from "../Config/configDB";

type TypeOwner = "transportador" | "comprador" | "vendedor";

class BuyRepository {
    static async getByOwner(id_user: number, typeOwner: TypeOwner) {
        let whereSentence = "WHERE "
        if (typeOwner === "transportador") whereSentence+="c.id_transportador = ?"
        else if (typeOwner === "comprador") whereSentence+="c.id_comprador = ?"
        else if (typeOwner === "vendedor") whereSentence+="c.id_vendedor = ?"

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

    static async assignTransporter(id_user:number, id_compra:number, id_transportador:number, precio_transporte:number){
        const query = `
        UPDATE compra
        SET id_transportador = ?, estado = ?, precio_transporte = ?
        WHERE id_compra = ?
        `
        const [result]: any = await db.execute(query, [id_transportador,"Asignada", id_compra])
        return result;
    }

    static async getAllAdmin(){
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