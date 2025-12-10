import supabase from '../Config/configDB';

class BuyerRepository {
    static async add(id_comprador: number) {
        const { data, error } = await supabase
            .from('comprador')
            .insert({ id_comprador })
            .select();

        if (error) {
            console.error('Error adding buyer:', error);
            throw error;
        }

        return data;
    }
}

export default BuyerRepository;
