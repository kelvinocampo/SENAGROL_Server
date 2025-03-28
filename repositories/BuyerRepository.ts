import db from '../config/configDB';

class BuyerRepository {
    static async add(id_comprador: number) {
        const sql = `INSERT INTO comprador (id_comprador) 
                     VALUES (?)`;
        const values = [id_comprador];
        const [result]: any = await db.execute(sql, values);
        return result;
    }
}

export default BuyerRepository;
