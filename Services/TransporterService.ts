import TransporterDto from '../Dto/User/TransporterDto';
import BuyRepository from '../Repositories/BuyRepository';
import TransporterRepository from '../Repositories/TransporterRepository';

class TransporterService {
    static async register(transporter: TransporterDto, imagesName: string[]) {
        const result = await TransporterRepository.register(transporter, imagesName);
        return result;
    }

    static async getTransports(id_user:number) {
        const result = await BuyRepository.getByOwner(id_user, "transportador");
        return result;
    }

    static async getTransporters() {
        const result = await TransporterRepository.getTransporters();
        return result;
    }
}

export default TransporterService;
