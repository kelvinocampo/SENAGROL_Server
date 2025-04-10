import TransporterDto from '../Dto/User/Transporter/TransporterDto';
import TransporterRepository from '../repositories/TransporterRepository';

class TransporterService {
    static async register(transporter: TransporterDto, imageName: string) {
        const result = await TransporterRepository.register(transporter, imageName);
        return result;
    }
}

export default TransporterService;
