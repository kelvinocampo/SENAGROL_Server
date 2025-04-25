import TransporterDto from '../Dto/User/TransporterDto';
import TransporterRepository from '../Repositories/TransporterRepository';

class TransporterService {
    static async register(transporter: TransporterDto, imageName: string) {
        const result = await TransporterRepository.register(transporter, imageName);
        return result;
    }
}

export default TransporterService;
