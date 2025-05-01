import AdminRepository from "../Repositories/AdminRepository";

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
}

export default Adminservice;
