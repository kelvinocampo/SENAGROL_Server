import supabase from "../Config/configDB";
import { RequiredRoles } from "../Middleware/VerifyTokenData";

class AdminRepository {
  static async ActiveSeller(userId: number) {
    const { data: solicitud, error: checkError } = await supabase
      .from('vendedor')
      .select('*')
      .eq('id_vendedor', userId)
      .eq('estado', 'Pendiente');

    if (checkError) {
      console.error('Error checking seller request:', checkError);
      throw checkError;
    }

    if (!solicitud || solicitud.length === 0) {
      return { success: false, message: "No hay una solicitud pendiente para este usuario." };
    }

    // Desactivar otros roles si existen
    await Promise.all([
      supabase.from('administrador').update({ estado: 'Pendiente' }).eq('id_administrador', userId),
      supabase.from('comprador').update({ estado: 'Pendiente' }).eq('id_comprador', userId)
    ]);

    const { error: updateError } = await supabase
      .from('vendedor')
      .update({ estado: 'Activo' })
      .eq('id_vendedor', userId);

    if (updateError) {
      console.error('Error activating seller:', updateError);
      throw updateError;
    }

    return { success: true, message: "Usuario aprobado como vendedor." };
  }

  static async ActiveTransporter(userId: number) {
    const { data: solicitud, error: checkError } = await supabase
      .from('transportador')
      .select('*')
      .eq('id_transportador', userId)
      .eq('estado', 'Pendiente');

    if (checkError) {
      console.error('Error checking transporter request:', checkError);
      throw checkError;
    }

    if (!solicitud || solicitud.length === 0) {
      return { success: false, message: "No hay una solicitud pendiente para este usuario." };
    }

    // Desactivar otros roles si existen
    await Promise.all([
      supabase.from('administrador').update({ estado: 'Pendiente' }).eq('id_administrador', userId),
      supabase.from('comprador').update({ estado: 'Pendiente' }).eq('id_comprador', userId)
    ]);

    const { error: updateError } = await supabase
      .from('transportador')
      .update({ estado: 'Activo' })
      .eq('id_transportador', userId);

    if (updateError) {
      console.error('Error activating transporter:', updateError);
      throw updateError;
    }

    return { success: true, message: "Usuario aprobado como transportador." };
  }

  static async CreateAdmin(userId: number) {
    try {
      // Desactivar otros roles si existen
      await Promise.all([
        supabase.from('comprador').update({ estado: 'Pendiente' }).eq('id_comprador', userId),
        supabase.from('transportador').update({ estado: 'Pendiente' }).eq('id_transportador', userId),
        supabase.from('vendedor').update({ estado: 'Pendiente' }).eq('id_vendedor', userId)
      ]);

      // Usar upsert para INSERT ON DUPLICATE KEY UPDATE
      const { data, error } = await supabase
        .from('administrador')
        .upsert(
          { id_administrador: userId, estado: 'Activo' },
          { onConflict: 'id_administrador' }
        )
        .select();

      if (error) {
        console.error('Error creating admin:', error);
        throw error;
      }

      if (data && data.length > 0) {
        return { success: true, message: `El usuario ${userId} ahora es administrador.` };
      } else {
        return { success: false, message: `No se encontró el usuario.` };
      }
    } catch (error) {
      console.error("Error en AdminRepository.CreateAdmin:", error);
      throw error;
    }
  }

  static async deleteUser(id_delete_user: number) {
    const { data, error } = await supabase
      .from('usuario')
      .delete()
      .eq('id_usuario', id_delete_user)
      .select();

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    return data;
  }

  static async deactivateRole(id_deactivate_user: number, role: Omit<RequiredRoles, "comprador">) {
    // Desactivar el rol especificado solo si está activo
    const { data, error } = await supabase
      .from(role)
      .update({ estado: 'Pendiente' })
      .eq(`id_${role}`, id_deactivate_user)
      .eq('estado', 'Activo')
      .select();

    if (error) {
      console.error('Error deactivating role:', error);
      throw error;
    }

    // Verificar si el usuario tiene algún otro rol activo
    const [adminResult, vendedorResult, transportadorResult] = await Promise.all([
      supabase.from('administrador').select('estado').eq('id_administrador', id_deactivate_user).eq('estado', 'Activo').single(),
      supabase.from('vendedor').select('estado').eq('id_vendedor', id_deactivate_user).eq('estado', 'Activo').single(),
      supabase.from('transportador').select('estado').eq('id_transportador', id_deactivate_user).eq('estado', 'Activo').single()
    ]);

    const admin_activo = adminResult.data?.estado || null;
    const vendedor_activo = vendedorResult.data?.estado || null;
    const transportador_activo = transportadorResult.data?.estado || null;

    const tieneRolActivo = admin_activo || vendedor_activo || transportador_activo;

    // Si no tiene ningún otro rol activo, dejar el rol de comprador como activo
    if (!tieneRolActivo) {
      await supabase
        .from('comprador')
        .update({ estado: 'Activo' })
        .eq('id_comprador', id_deactivate_user);
    }

    return data;
  }

}

export default AdminRepository;
