import { getAddressByCoords } from '../Helpers/GetAddressByCoords';
import BuyRepository from '../Repositories/BuyRepository';
import Hashids from 'hashids/cjs';
// Configuración del hash
const hashids = new Hashids(process.env.KEY_TOKEN, 5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

class BuyService {
    static async generateCode(id_compra: number, id_user: number) {
        const result = await BuyRepository.generateCode(id_compra, id_user);

        // BuyRepository.generateCode ahora retorna un array
        if (!result || result.length === 0) {
            throw new Error("Compra no encontrada o sin permiso.");
        }

        const buy = result[0];
        let estadoNumerico: number;

        if (buy.estado === "Asignada") {
            estadoNumerico = 1; // inicia
        } else if (buy.estado === "En Proceso") {
            estadoNumerico = 2; // termina
        } else {
            throw new Error("Estado no válido para generar código.");
        }

        // Codificar id_compra y estado como un solo código
        const codigo = hashids.encode(id_compra, estadoNumerico);

        return {
            id_compra: buy.id_compra,
            estado: buy.estado,
            codigo: codigo
        };
    }

    static async receiveCodeBuy(codigo: string, id_user: number) {
        const [id_compra, estadoNum] = hashids.decode(codigo);
        const estado = estadoNum === 1 ? 'En Proceso' : estadoNum === 2 ? 'Completada' : '';
        if (!estado) {
            return { success: false, message: "Codigo invalido." };
        }

        const result = await BuyRepository.receiveCodeBuy(Number(id_compra), estado, id_user);
        // Supabase retorna array
        if (!result || result.length === 0) {
            return { success: false, message: "No se pudo actualizar el estado." };
        }
        return { success: true, message: "Estado actualizado." };
    }

    static async cancelTransport(id_user: number, id_compra: number) {
        const getBuy: any = await BuyRepository.getById(id_compra)
        if (!getBuy || getBuy.length === 0) {
            return { code: 400, success: false, message: "compra no encontrada" }
        }
        if (getBuy[0].estado != "Asignada") {
            return { code: 409, success: false, message: "Solo se puede cancelar el transporte a una compra asignada." }
        }

        const result: any = await BuyRepository.cancelTransport(id_user, id_compra)
        // Supabase retorna array
        if (!result || result.length === 0) {
            return { code: 400, success: false, message: "transporte no cancelado" }
        }
        return { code: 200, success: true, message: "Transporte Cancelado" }
    }

    static async getLocation(id_user: number, id_compra: number) {
        const getBuy: any = await BuyRepository.getById(id_compra)
        if (!getBuy || getBuy.length === 0) {
            return { code: 400, success: false, message: "compra no encontrada" }
        }

        const result: any = await BuyRepository.getLocation(id_user, id_compra)
        if (!result || result.length === 0) {
            return { code: 400, success: false, message: "No se pudo obtener la ubicación." }
        }
        return { code: 200, success: true, message: result[0] }
    }

    static async getAddress(lat: number, lon: number) {
        const result: any = await getAddressByCoords(lat, lon)
        if (!result || result.length === 0) {
            return { code: 400, success: false, message: "No se pudo obtener la dirección." }
        }
        return { code: 200, success: true, message: result }
    }
}

export default BuyService;
