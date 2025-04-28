import BuyRepository from '../Repositories/BuyRepository';

class BuyerService {
    static async getBuys(id_user:number) {
        const result = await BuyRepository.getByOwner(id_user, "comprador");
        return result;
    }
}

export default BuyerService;
