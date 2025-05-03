import { RequiredRoles } from "../Middleware/VerifyTokenData";
import AdminRepository from "../Repositories/AdminRepository";
import BuyRepository from "../Repositories/BuyRepository";
import ProductRepository from "../Repositories/ProductRepository";

class Adminservice {
    static async ActiveSeller(userId: number) {
        const result = await AdminRepository.ActiveSeller(userId)
        return result
    }
    static async ActiveTransporter(userId: number) {
        const result = await AdminRepository.ActiveTransporter(userId)
        return result
    }
    static async CreateAdmin(id_new_admin: number) {
        const result = await AdminRepository.CreateAdmin(id_new_admin)
        return result
    }
    static async deleteUser(id_delete_user: number) {
        const result = await AdminRepository.deleteUser(id_delete_user)
        return result
    }
    static async deactivateRole(id_deactivate_user: number, role: string) {
        const result = await AdminRepository.deactivateRole(id_deactivate_user, role as RequiredRoles)
        return result
    }
    static async getProducts() {
        const result = await ProductRepository.getAllAdmin()
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

export default Adminservice;
