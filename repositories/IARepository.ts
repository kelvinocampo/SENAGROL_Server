import db from '../config/configDB';


class IARepository {
    static async querySQL(query: string) {
        return db.execute(query);
    }
}


export default IARepository;