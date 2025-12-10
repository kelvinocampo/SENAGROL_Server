import supabase from "../Config/configDB";

class SellerRepository {
    static async requestSeller(userId: number) {
        // Verificar si ya tiene registro como vendedor
        const { data: existingSeller, error: checkError } = await supabase
            .from('vendedor')
            .select('estado')
            .eq('id_vendedor', userId);

        if (checkError) {
            console.error('Error checking seller:', checkError);
            throw checkError;
        }

        if (existingSeller && existingSeller.length > 0) {
            if (existingSeller[0].estado === 'Pendiente') {
                return { success: false, message: "Ya tienes una solicitud pendiente." };
            }
            return { success: false, message: "Ya eres vendedor." };
        }

        // Insertar nueva solicitud de vendedor con estado 'Pendiente'
        const { error: insertError } = await supabase
            .from('vendedor')
            .insert({ id_vendedor: userId, estado: 'Pendiente' });

        if (insertError) {
            console.error('Error inserting seller request:', insertError);
            throw insertError;
        }

        return { success: true, message: "Solicitud enviada correctamente." };
    }

}

export default SellerRepository;