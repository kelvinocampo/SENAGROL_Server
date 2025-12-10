import supabase from '../Config/configDB';
import User from '../Dto/User/UserDto';

class UserRepository {

    static async getUserRoles(userId: number) {
        // Convertir UNION queries a múltiples consultas paralelas
        const [vendedorResult, adminResult, transportadorResult, compradorResult] = await Promise.all([
            supabase.from('vendedor').select('id_vendedor').eq('id_vendedor', userId).eq('estado', 'Activo').single(),
            supabase.from('administrador').select('id_administrador').eq('id_administrador', userId).eq('estado', 'Activo').single(),
            supabase.from('transportador').select('id_transportador').eq('id_transportador', userId).eq('estado', 'Activo').single(),
            supabase.from('comprador').select('id_comprador').eq('id_comprador', userId).eq('estado', 'Activo').single()
        ]);

        const roles: string[] = [];
        if (vendedorResult.data) roles.push('vendedor');
        if (adminResult.data) roles.push('administrador');
        if (transportadorResult.data) roles.push('transportador');
        if (compradorResult.data) roles.push('comprador');

        return roles.join(' ');
    }


    static async add(user: User) {
        const { data, error } = await supabase
            .from('usuario')
            .insert({
                nombre: user.name,
                nombre_usuario: user.username,
                correo: user.email,
                contraseña: user.password,
                telefono: user.phoneNumber
            })
            .select('id_usuario')
            .single();

        if (error) {
            console.error('Error adding user:', error);
            throw error;
        }

        return data.id_usuario;
    }

    static async getByID(id: number) {
        const { data, error } = await supabase
            .from('usuario')
            .select('*')
            .eq('id_usuario', id);

        if (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }

        return data || [];
    }

    static async getByEmail(email: string) {
        const { data, error } = await supabase
            .from('usuario')
            .select('*')
            .eq('correo', email);

        if (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }

        return data || [];
    }

    static async getAll(user_id: number) {
        // Obtener todos los usuarios excepto el actual
        const { data: usuarios, error: usuariosError } = await supabase
            .from('usuario')
            .select('*')
            .neq('id_usuario', user_id);

        if (usuariosError) {
            console.error('Error getting all users:', usuariosError);
            throw usuariosError;
        }

        if (!usuarios) return [];

        // Para cada usuario, obtener sus roles
        const usuariosConRoles = await Promise.all(usuarios.map(async (usuario) => {
            const [admin, vendedor, transportador, comprador] = await Promise.all([
                supabase.from('administrador').select('id_administrador').eq('id_administrador', usuario.id_usuario).single(),
                supabase.from('vendedor').select('id_vendedor, estado').eq('id_vendedor', usuario.id_usuario).single(),
                supabase.from('transportador').select('id_transportador, estado').eq('id_transportador', usuario.id_usuario).single(),
                supabase.from('comprador').select('id_comprador, estado').eq('id_comprador', usuario.id_usuario).single()
            ]);

            const roles: string[] = [];
            if (admin.data) roles.push('Administrador');
            if (vendedor.data && vendedor.data.estado === 'Activo') roles.push('Vendedor');
            if (transportador.data && transportador.data.estado === 'Activo') roles.push('Transportador');
            if (comprador.data && comprador.data.estado === 'Activo') roles.push('Comprador');

            return {
                ...usuario,
                roles: roles.join(',')
            };
        }));

        return usuariosConRoles;
    }

    static async getAllAdmin() {
        // Obtener todos los usuarios
        const { data: usuarios, error: usuariosError } = await supabase
            .from('usuario')
            .select('*');

        if (usuariosError) {
            console.error('Error getting all users for admin:', usuariosError);
            throw usuariosError;
        }

        if (!usuarios) return [];

        // Para cada usuario, obtener el estado de cada rol
        const usuariosConRoles = await Promise.all(usuarios.map(async (usuario) => {
            const [admin, vendedor, transportador, comprador] = await Promise.all([
                supabase.from('administrador').select('id_administrador, estado').eq('id_administrador', usuario.id_usuario).single(),
                supabase.from('vendedor').select('id_vendedor, estado').eq('id_vendedor', usuario.id_usuario).single(),
                supabase.from('transportador').select('id_transportador, estado').eq('id_transportador', usuario.id_usuario).single(),
                supabase.from('comprador').select('id_comprador, estado').eq('id_comprador', usuario.id_usuario).single()
            ]);

            // Solo incluir usuarios que tengan al menos un rol
            if (!admin.data && !vendedor.data && !transportador.data && !comprador.data) {
                return null;
            }

            return {
                ...usuario,
                rol_administrador: admin.data ? admin.data.estado : 'No disponible',
                rol_comprador: comprador.data ? comprador.data.estado : 'No disponible',
                rol_vendedor: vendedor.data ? vendedor.data.estado : 'No disponible',
                rol_transportador: transportador.data ? transportador.data.estado : 'No disponible'
            };
        }));

        // Filtrar nulls
        return usuariosConRoles.filter(u => u !== null);
    }

    static async UpdatePassword(password: string, id_user: number,) {
        const { data, error } = await supabase
            .from('usuario')
            .update({ contraseña: password })
            .eq('id_usuario', id_user)
            .select();

        if (error) {
            console.error('Error updating password:', error);
            throw error;
        }

        return data;
    }

    static async findByEmailOrUsername(identifier: string) {
        const { data, error } = await supabase
            .from('usuario')
            .select('*')
            .or(`correo.eq.${identifier},nombre_usuario.eq.${identifier}`)
            .limit(1);

        if (error) {
            console.error('Error finding user by email or username:', error);
            throw error;
        }

        if (data && data.length > 0) {
            return data[0];
        }

        return null;
    }

    static async update(id: number, updatedData: User) {
        const updateObj: any = {};

        if (updatedData.name) {
            updateObj.nombre = updatedData.name;
        }

        if (updatedData.username) {
            updateObj.nombre_usuario = updatedData.username;
        }

        if (updatedData.email) {
            updateObj.correo = updatedData.email;
        }

        if (updatedData.phoneNumber) {
            updateObj.telefono = updatedData.phoneNumber;
        }

        if (Object.keys(updateObj).length === 0) {
            throw new Error("No se proporcionaron datos para actualizar");
        }

        const { data, error } = await supabase
            .from('usuario')
            .update(updateObj)
            .eq('id_usuario', id)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            throw error;
        }

        if (data && data.length > 0) {
            return { success: true, status: "Perfil actualizado correctamente" };
        } else {
            return { success: false, status: "No se encontraron cambios o usuario no encontrado" };
        }
    }
}

export default UserRepository;
