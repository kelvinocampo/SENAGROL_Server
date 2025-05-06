import { RequiredRoles } from "../Middleware/VerifyTokenData";
import AdminRepository from "../Repositories/AdminRepository";
import BuyRepository from "../Repositories/BuyRepository";
import ProductRepository from "../Repositories/ProductRepository";
import UserRepository from "../Repositories/UserRepository";

class AdminService {
    static async ActiveSeller(userId: number) {
        const result = await AdminRepository.ActiveSeller(userId)
        return result
    }
    static async ActiveTransporter(userId: number) {
        const result = await AdminRepository.ActiveTransporter(userId)
        return result
    }
    static async CreateAdmin(id_new_admin: number) {
        const result: any = await AdminRepository.CreateAdmin(id_new_admin)
        if (result.affectedRows > 0) return { message: `Nuevo Admin creado con la ID ${id_new_admin}` }
        if (result.affectedRows == 0) return { message: `Usuario con la ID ${id_new_admin} no encontrado` }
    }
    static async deleteUser(id_delete_user: number) {
        const result: any = await AdminRepository.deleteUser(id_delete_user)
        if (result.affectedRows > 0) return { message: `Usuario eliminado` }
        if (result.affectedRows == 0) return { message: `Usuario con la ID ${id_delete_user} no encontrado` }
    }
    static async deactivateRole(id_deactivate_user: number, role: string) {
        const result: any = await AdminRepository.deactivateRole(id_deactivate_user, role as Omit<RequiredRoles, "comprador">)
        if (result.affectedRows > 0) return { message: `Usuario ya no posee el rol indicado` }
        if (result.affectedRows == 0) return { message: `Usuario no encontrado con el rol indicado` }
    }
    static async getProducts() {
        const result = await ProductRepository.getAllAdmin()
        return result
    }
    static async getUsers() {
        const result = await UserRepository.getAllAdmin()
        return result
    }
    static async getSales() {
        const result = await BuyRepository.getAllAdmin()
        return result
    }
    static async unpublishProduct(id_producto: number) {
        const result = await ProductRepository.unpublishProduct(id_producto)
        return result
    }
}

export default AdminService;
