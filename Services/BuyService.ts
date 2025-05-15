import BuyRepository from '../Repositories/BuyRepository';
import Hashids from 'hashids/cjs';
// Configuración del hash
const hashids = new Hashids(process.env.KEY_TOKEN, 5, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

class BuyService {
    static async generateCode(id_compra: number, id_user: number) {
        const [result] = await BuyRepository.generateCode(id_compra, id_user);

        let estadoNumerico: number;

        if (result.estado === "Asignada") {
            estadoNumerico = 1; // inicia
        } else if (result.estado === "En Proceso") {
            estadoNumerico = 2; // termina
        } else {
            throw new Error("Estado no válido para generar código.");
        }

        // Codificar id_compra y estado como un solo código
        const codigo = hashids.encode(id_compra, estadoNumerico);

        return {
            id_compra: result.id_compra,
            estado: result.estado,
            codigo: codigo
        };
    }

    static async receiveCodeBuy(codigo: string, id_user: number) {
        const [id_compra, estadoNum] = hashids.decode(codigo);
        const estado = estadoNum === 1 ? 'En Proceso' : estadoNum === 2 ? 'Completada' : '';
        if (!estado) {
            return { success: false, message: "Codigo invalido." };
        }

        const result = await BuyRepository.receiveCodeBuy(parseInt(id_compra), estado, id_user);
        if (result.affectedRows === 0) {
            return { success: false, message: "No se pudo actualizar el estado." };
        }
        return { success: true, message: "Estado actualizado." };
    }
}

export default BuyService;
