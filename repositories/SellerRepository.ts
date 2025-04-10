import db from "../config/configDB";

class SellerRepository {
    static async requestSeller(userId: number) {
        // Verificar si ya tiene registro como vendedor
        const [existingSeller]: any = await db.execute(
            "SELECT estado FROM vendedor WHERE id_vendedor = ?", 
            [userId]
        );
    
        if (existingSeller.length > 0) {
            if (existingSeller[0].estado === 'Pendiente') {
                return { success: false, message: "Ya tienes una solicitud pendiente." };
            }
            return { success: false, message: "Ya eres vendedor." };
        }
    
        // Eliminar otros roles si existen
        const deleteAdminSql = `DELETE FROM administrador WHERE id_administrador = ?`;
        const deleteBuyerSql = `DELETE FROM comprador WHERE id_comprador = ?`;
        const deleteTransporterSql = `DELETE FROM transportador WHERE id_transportador = ?`;
    
        await db.execute(deleteAdminSql, [userId]);
        await db.execute(deleteBuyerSql, [userId]);
        await db.execute(deleteTransporterSql, [userId]);
    
        // Insertar nueva solicitud de vendedor con estado 'Pendiente'
        await db.execute(
            "INSERT INTO vendedor (id_vendedor, estado) VALUES (?, 'Pendiente')", 
            [userId]
        );
    
        return { success: true, message: "Solicitud enviada correctamente." };
    }
    
}

export default SellerRepository;