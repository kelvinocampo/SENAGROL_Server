import supabase from '../Config/configDB';
import TransporterDto from '../Dto/User/TransporterDto';

class TransporterRepository {
    static async register(transporter: TransporterDto, imagesName: string[]) {
        // 0. Verificar si ya es transportador
        const { data: existingTransporter, error: checkError } = await supabase
            .from('transportador')
            .select('*')
            .eq('id_transportador', transporter.userId);

        if (checkError) {
            console.error('Error checking transporter:', checkError);
            throw checkError;
        }

        if (existingTransporter && existingTransporter.length > 0) {
            throw new Error("El usuario ya está registrado como transportador");
        }

        // 2. Insertar en la tabla de transportadores
        const { error: insertError } = await supabase
            .from('transportador')
            .insert({
                id_transportador: transporter.userId,
                licencia_conduccion: transporter.license,
                soat: transporter.soat,
                tarjeta_propiedad_vehiculo: transporter.vehicleCard,
                tipo_vehiculo: transporter.vehicleType,
                peso_vehiculo: transporter.vehicleWeight
            });

        if (insertError) {
            console.error('Error inserting transporter:', insertError);
            throw insertError;
        }

        // Insertar imágenes en paralelo
        if (imagesName.length > 0) {
            await Promise.all(imagesName.map(imageName =>
                this.registerImage(imageName, transporter.userId)
            ));
        }

        return { success: true };
    }

    static async update(dataTransporter: TransporterDto, imagesName: string[]) {
        const updateObj: any = {};

        if (dataTransporter.license) {
            updateObj.licencia_conduccion = dataTransporter.license;
        }
        if (dataTransporter.soat) {
            updateObj.soat = dataTransporter.soat;
        }
        if (dataTransporter.vehicleCard) {
            updateObj.tarjeta_propiedad_vehiculo = dataTransporter.vehicleCard;
        }
        if (dataTransporter.vehicleType) {
            updateObj.tipo_vehiculo = dataTransporter.vehicleType;
        }
        if (dataTransporter.vehicleWeight) {
            updateObj.peso_vehiculo = dataTransporter.vehicleWeight;
        }

        if (Object.keys(updateObj).length === 0) {
            throw new Error("No se proporcionaron datos para actualizar");
        }

        // Insertar nuevas imágenes en paralelo
        if (imagesName.length > 0) {
            await Promise.all(imagesName.map(imageName =>
                this.registerImage(imageName, dataTransporter.userId)
            ));
        }

        const { data, error } = await supabase
            .from('transportador')
            .update(updateObj)
            .eq('id_transportador', dataTransporter.userId)
            .select();

        if (error) {
            console.error('Error updating transporter:', error);
            throw error;
        }

        if (data && data.length > 0) {
            return { success: true, status: "Perfil actualizado correctamente" };
        } else {
            return { success: false, status: "No se encontraron cambios o usuario no encontrado" };
        }
    }

    static async registerImage(imageName: string, id_user: number) {
        const { error } = await supabase
            .from('foto_vehiculo')
            .insert({
                foto: imageName,
                id_transportador: id_user
            });

        if (error) {
            console.error('Error registering vehicle image:', error);
            throw error;
        }

        return { success: true };
    }

    static async getTransporters() {
        // Obtener transportadores activos
        const { data: transportadores, error: transportadoresError } = await supabase
            .from('transportador')
            .select(`
                *,
                usuario!inner(id_usuario, nombre, nombre_usuario, correo, telefono)
            `)
            .eq('estado', 'Activo');

        if (transportadoresError) {
            console.error('Error getting transporters:', transportadoresError);
            throw transportadoresError;
        }

        if (!transportadores) return [];

        // Para cada transportador, obtener sus fotos
        const transportadoresConFotos = await Promise.all(transportadores.map(async (t) => {
            const { data: fotos } = await supabase
                .from('foto_vehiculo')
                .select('foto')
                .eq('id_transportador', t.id_transportador);

            const fotosVehiculo = fotos ? fotos.map(f => f.foto).join(',') : '';

            return {
                id_usuario: t.usuario.id_usuario,
                nombre: t.usuario.nombre,
                nombre_usuario: t.usuario.nombre_usuario,
                correo: t.usuario.correo,
                telefono: t.usuario.telefono,
                tipo_vehiculo: t.tipo_vehiculo,
                peso_vehiculo: t.peso_vehiculo,
                fotos_vehiculo: fotosVehiculo
            };
        }));

        return transportadoresConFotos;
    }

    static async getById(id_transporter: number) {
        const { data: transportador, error: transportadorError } = await supabase
            .from('transportador')
            .select('*')
            .eq('id_transportador', id_transporter)
            .eq('estado', 'Activo')
            .single();

        if (transportadorError || !transportador) {
            return [];
        }

        // Obtener fotos del vehículo
        const { data: fotos } = await supabase
            .from('foto_vehiculo')
            .select('foto')
            .eq('id_transportador', id_transporter);

        const fotosVehiculo = fotos ? fotos.map(f => f.foto).join(',') : '';

        return [{
            licencia_conduccion: transportador.licencia_conduccion,
            soat: transportador.soat,
            tarjeta_propiedad_vehiculo: transportador.tarjeta_propiedad_vehiculo,
            tipo_vehiculo: transportador.tipo_vehiculo,
            peso_vehiculo: transportador.peso_vehiculo,
            fotos_vehiculo: fotosVehiculo
        }];
    }

    static async getByIdSAdmin(id_transporter: number) {
        const { data: transportador, error: transportadorError } = await supabase
            .from('transportador')
            .select('*')
            .eq('id_transportador', id_transporter)
            .single();

        if (transportadorError || !transportador) {
            return [];
        }

        // Obtener fotos del vehículo
        const { data: fotos } = await supabase
            .from('foto_vehiculo')
            .select('foto')
            .eq('id_transportador', id_transporter);

        const fotosVehiculo = fotos ? fotos.map(f => f.foto).join(',') : '';

        return [{
            licencia_conduccion: transportador.licencia_conduccion,
            soat: transportador.soat,
            tarjeta_propiedad_vehiculo: transportador.tarjeta_propiedad_vehiculo,
            tipo_vehiculo: transportador.tipo_vehiculo,
            peso_vehiculo: transportador.peso_vehiculo,
            estado: transportador.estado,
            fotos_vehiculo: fotosVehiculo
        }];
    }


}

export default TransporterRepository;
