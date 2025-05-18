import db from '../Config/configDB';


class IARepository {
    static async querySQL(query: string) {
        return (await db.execute(query))[0];
    }
}


export default IARepository;