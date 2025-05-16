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
    static async CreateAdmin(userId: number): Promise<{ success: boolean; message: string }> {
        const result = await AdminRepository.CreateAdmin(userId);

        // Si result es undefined o nulo
        if (!result) {
            return { success: false, message: "No se pudo procesar la solicitud para este usuario." };
        }

        // Si result tiene affectedRows


        // Si result ya contiene message y success
        return result;
    }

    static async deleteUser(id_delete_user: number) {
        const buys = await BuyRepository.getAllByUserId(id_delete_user)
        const roles = await UserRepository.getUserRoles(id_delete_user)
        const buysStates = buys.map((buy: any) => buy.estado)
        const isPending = buysStates.some((state: string) => state === "Pendiente")
        const isAssigned = buysStates.some((state: string) => state === "Asignada")
        const isInProgress = buysStates.some((state: string) => state === "En Proceso")
        const isDelivered = buysStates.some((state: string) => state === "Completada")
        if (isInProgress) {
            return { status: 200, message: `El usuario no puede ser eliminado porque tiene compras en proceso` }
        }
        if (isAssigned && roles.includes("transportador")) {
            const updateToPendingBuys = await BuyRepository.updateToPendingBuys(id_delete_user)
        }
        if (isAssigned && roles.includes("vendedor")) {
            // eliminar productos del vendedor
            const deleteProducts = await ProductRepository.deleteProductsBySeller(id_delete_user)
            const deletePendingBuys = await BuyRepository.deleteBuysPending(id_delete_user)
        }
        if (isPending && (roles.includes("vendedor") || roles.includes("comprador"))) {
            const deleteBuysPending = await BuyRepository.deleteBuysPending(id_delete_user)
        }
        if (isDelivered) {
            // Cambiar el nombre del usuario en la compra 
            const rolesList = roles.split(" ")
            const [dataUser] = await UserRepository.getByID(id_delete_user)
            const name = dataUser.nombre
            rolesList.forEach(async (role: string) => {
                if (role === "vendedor") {
                    const updateName = await BuyRepository.setNameDeletedUser(id_delete_user, "vendedor", name)
                }
                if (role === "comprador") {
                    const updateName = await BuyRepository.setNameDeletedUser(id_delete_user, "comprador", name)
                }
                if (role === "transportador") {
                    const updateName = await BuyRepository.setNameDeletedUser(id_delete_user, "transportador", name)
                }
            })
        }

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
    static async publishProduct(id_producto: number) {
        const result = await ProductRepository.publishProduct(id_producto)
        return result
    }
}

export default AdminService;
