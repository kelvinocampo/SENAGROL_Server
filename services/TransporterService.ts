
import TransporterDto from '../Dto/User/Transporter/TransporterDto';
import TransporterRepository from '../repositories/TransporterRepository';

class TransporterService {
    static async register(transporter: TransporterDto) {
        const result = await TransporterRepository.register(transporter)
        return result;
    }
}

export default TransporterService;

