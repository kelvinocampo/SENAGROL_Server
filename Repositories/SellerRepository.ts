import db from "../Config/configDB";

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
    
        // Insertar nueva solicitud de vendedor con estado 'Pendiente'
        await db.execute(
            "INSERT INTO vendedor (id_vendedor, estado) VALUES (?, 'Pendiente')", 
            [userId]
        );
    
        return { success: true, message: "Solicitud enviada correctamente." };
    }
    
}

export default SellerRepository;