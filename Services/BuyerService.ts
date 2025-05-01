import BuyRepository from '../Repositories/BuyRepository';

class BuyerService {
    static async getBuys(id_user: number) {
        const result = await BuyRepository.getByOwner(id_user, "comprador");
        return result;
    }

    static async assignTransporter(id_user: number, id_compra: number, id_transportador: number, precio_transporte:number) {
        const result = await BuyRepository.assignTransporter(id_user, id_compra, id_transportador, precio_transporte);
        return result;
    }
}

export default BuyerService;
