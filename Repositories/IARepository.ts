import db from '../Config/configDB';


class IARepository {
    static async querySQL(query: string) {
        return db.execute(query);
    }
}


export default IARepository;