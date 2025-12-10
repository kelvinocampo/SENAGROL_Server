import supabase from "../Config/configDB";
import BuyRepository from "../Repositories/BuyRepository";
import SellerRepository from "../Repositories/SellerRepository";

class VendedorService {
    static async requestSeller(userId: number) {
        const result = await SellerRepository.requestSeller(userId)
        return result;
    }

    static async getSells(id_user: number) {
        const result = await BuyRepository.getByOwner(id_user, "vendedor")
        return result;
    }

    static async aprobarSolicitud(adminId: number, userId: number) {
        // Verificar si el usuario que aprueba es administrador
        const { data: adminCheck, error: adminError } = await supabase
            .from('administrador')
            .select('*')
            .eq('id_administrador', adminId);

        if (adminError || !adminCheck || adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para aprobar solicitudes." };
        }

        // Verificar si la solicitud existe y está pendiente
        const { data: solicitud, error: solicitudError } = await supabase
            .from('vendedor')
            .select('*')
            .eq('id_vendedor', userId)
            .eq('estado', 'Pendiente');

        if (solicitudError || !solicitud || solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        // Aprobar la solicitud de vendedor
        await supabase
            .from('vendedor')
            .update({ estado: 'Activo' })
            .eq('id_vendedor', userId);

        return { success: true, message: "Usuario aprobado como vendedor." };
    }

    static async rechazarSolicitud(adminId: number, userId: number) {

        const { data: adminCheck, error: adminError } = await supabase
            .from('administrador')
            .select('*')
            .eq('id_administrador', adminId);

        if (adminError || !adminCheck || adminCheck.length === 0) {
            return { success: false, message: "No tienes permisos para rechazar solicitudes." };
        }

        // Verificar si la solicitud existe y está pendiente
        const { data: solicitud, error: solicitudError } = await supabase
            .from('vendedor')
            .select('*')
            .eq('id_vendedor', userId)
            .eq('estado', 'Pendiente');

        if (solicitudError || !solicitud || solicitud.length === 0) {
            return { success: false, message: "No hay una solicitud pendiente para este usuario." };
        }

        // Rechazar la solicitud eliminando el registro de vendedor
        await supabase
            .from('vendedor')
            .delete()
            .eq('id_vendedor', userId);

        return { success: true, message: "Solicitud de vendedor rechazada." };
    }
}

export default VendedorService;
