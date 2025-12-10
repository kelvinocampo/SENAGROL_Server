import supabase from "../Config/configDB";

// Helper function to get user roles (reusable across repositories)
async function getUserRolesForChat(userId: number): Promise<string> {
    const [vendedorResult, adminResult, transportadorResult, compradorResult] = await Promise.all([
        supabase.from('vendedor').select('id_vendedor').eq('id_vendedor', userId).eq('estado', 'Activo').maybeSingle(),
        supabase.from('administrador').select('id_administrador').eq('id_administrador', userId).eq('estado', 'Activo').maybeSingle(),
        supabase.from('transportador').select('id_transportador').eq('id_transportador', userId).eq('estado', 'Activo').maybeSingle(),
        supabase.from('comprador').select('id_comprador').eq('id_comprador', userId).eq('estado', 'Activo').maybeSingle()
    ]);

    const roles: string[] = [];
    if (vendedorResult.data) roles.push('vendedor');
    if (adminResult.data) roles.push('administrador');
    if (transportadorResult.data) roles.push('transportador');
    if (compradorResult.data) roles.push('comprador');

    return roles.join(' ');
}

class ChatRepository {
    /**
     * Obtiene un chat por su ID
     * @param chatID - ID del chat a buscar
     * @returns El objeto del chat encontrado o null si no existe
     * @throws Error si ocurre un problema en la consulta
     */
    static async getChatById(chatID: number) {
        try {
            const { data, error } = await supabase
                .from('chat')
                .select('*')
                .eq('id_chat', chatID)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error("Error en ChatRepository.getChatById:", error);
                throw error;
            }

            return data || null;
        } catch (error) {
            console.error("Error en ChatRepository.getChatById:", error);
            throw error;
        }
    }

    /**
     * Obtiene todos los chats de un usuario, incluyendo su estado (Activo/Bloqueado)
     * @param id_user - ID del usuario cuyos chats se quieren obtener
     * @returns Array de chats con su información y estado
     * @throws Error si ocurre un problema en la consulta
     */
    static async getChats(id_user: number) {
        try {
            // Obtener chats del usuario
            const { data: chats, error: chatsError } = await supabase
                .from('chat')
                .select(`
                    *,
                    usuario_user1:usuario!chat_id_user1_fkey(nombre),
                    usuario_user2:usuario!chat_id_user2_fkey(nombre)
                `)
                .or(`id_user1.eq.${id_user},id_user2.eq.${id_user}`)
                .order('fecha_reciente', { ascending: false });

            if (chatsError) {
                console.error("Error en ChatRepository.getChats:", chatsError);
                throw chatsError;
            }

            if (!chats) return [];

            // Filtrar chats no eliminados y enriquecer con roles
            const chatsEnriquecidos = await Promise.all(
                chats
                    .filter(c => {
                        const eliminadoUser1 = c.eliminado_user1 || false;
                        const eliminadoUser2 = c.eliminado_user2 || false;
                        return (c.id_user1 === id_user && !eliminadoUser1) ||
                            (c.id_user2 === id_user && !eliminadoUser2);
                    })
                    .map(async (c) => {
                        // Obtener roles de ambos usuarios
                        const [rol_user1, rol_user2] = await Promise.all([
                            getUserRolesForChat(c.id_user1),
                            getUserRolesForChat(c.id_user2)
                        ]);

                        // Determinar estado del chat
                        const bloqueadoUser1 = c.bloqueado_user1 || false;
                        const bloqueadoUser2 = c.bloqueado_user2 || false;
                        let estado = 'Activo';
                        if ((c.id_user1 === id_user && bloqueadoUser1) ||
                            (c.id_user2 === id_user && bloqueadoUser2)) {
                            estado = 'Bloqueado';
                        }

                        return {
                            id_chat: c.id_chat,
                            bloqueado_user1: c.bloqueado_user1,
                            bloqueado_user2: c.bloqueado_user2,
                            eliminado_user1: c.eliminado_user1,
                            eliminado_user2: c.eliminado_user2,
                            fecha_reciente: c.fecha_reciente,
                            nombre_user1: c.usuario_user1?.nombre,
                            rol_user1,
                            nombre_user2: c.usuario_user2?.nombre,
                            rol_user2,
                            id_user1: c.id_user1,
                            id_user2: c.id_user2,
                            estado
                        };
                    })
            );

            return chatsEnriquecidos;
        } catch (error) {
            console.error("Error en ChatRepository.getChats:", error);
            throw new Error("No se pudieron obtener los chats");
        }
    }

    /**
     * Marca un chat como eliminado para un usuario específico (eliminación lógica)
     * @param id_user - ID del usuario que está eliminando el chat
     * @param id_chat - ID del chat a marcar como eliminado
     * @returns Objeto con el número de filas afectadas
     * @throws Error si no se encuentra el chat o hay un problema en la consulta
     */
    static async deleteChat(id_user: number, id_chat: number) {
        try {
            // Primero obtener el chat para saber qué campo actualizar
            const { data: chat } = await supabase
                .from('chat')
                .select('id_user1, id_user2')
                .eq('id_chat', id_chat)
                .single();

            if (!chat) {
                throw new Error('No se encontró el chat para eliminar');
            }

            // Determinar qué campo actualizar
            const updateObj: any = {};
            if (chat.id_user1 === id_user) {
                updateObj.eliminado_user1 = true;
            }
            if (chat.id_user2 === id_user) {
                updateObj.eliminado_user2 = true;
            }

            const { data, error } = await supabase
                .from('chat')
                .update(updateObj)
                .eq('id_chat', id_chat)
                .select();

            if (error) {
                console.error("Error en ChatRepository.deleteChat:", error);
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No se encontró el chat para eliminar');
            }

            return { affectedRows: data.length };
        } catch (error) {
            console.error("Error en ChatRepository.deleteChat:", error);
            throw error;
        }
    }

    /**
     * Bloquea un chat para un usuario específico
     * @param id_user - ID del usuario que está bloqueando el chat
     * @param id_chat - ID del chat a bloquear
     * @returns Resultado de la operación
     */
    static async blockChat(id_user: number, id_chat: number) {
        try {
            // Primero obtener el chat para saber qué campo actualizar
            const { data: chat } = await supabase
                .from('chat')
                .select('id_user1, id_user2')
                .eq('id_chat', id_chat)
                .single();

            if (!chat) {
                throw new Error('No se encontró el chat');
            }

            // Determinar qué campo actualizar
            const updateObj: any = {};
            if (chat.id_user1 === id_user) {
                updateObj.bloqueado_user1 = true;
            }
            if (chat.id_user2 === id_user) {
                updateObj.bloqueado_user2 = true;
            }

            const { data, error } = await supabase
                .from('chat')
                .update(updateObj)
                .eq('id_chat', id_chat)
                .select();

            if (error) {
                console.error("Error en ChatRepository.blockChat:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error en ChatRepository.blockChat:", error);
            throw error;
        }
    }

    /**
     * Desbloquea un chat para un usuario específico
     * @param id_user - ID del usuario que está desbloqueando el chat
     * @param id_chat - ID del chat a desbloquear
     * @returns Resultado de la operación
     */
    static async unblockChat(id_user: number, id_chat: number) {
        try {
            // Primero obtener el chat para saber qué campo actualizar
            const { data: chat } = await supabase
                .from('chat')
                .select('id_user1, id_user2')
                .eq('id_chat', id_chat)
                .single();

            if (!chat) {
                throw new Error('No se encontró el chat');
            }

            // Determinar qué campo actualizar
            const updateObj: any = {};
            if (chat.id_user1 === id_user) {
                updateObj.bloqueado_user1 = false;
            }
            if (chat.id_user2 === id_user) {
                updateObj.bloqueado_user2 = false;
            }

            const { data, error } = await supabase
                .from('chat')
                .update(updateObj)
                .eq('id_chat', id_chat)
                .select();

            if (error) {
                console.error("Error en ChatRepository.unblockChat:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error en ChatRepository.unblockChat:", error);
            throw error;
        }
    }

    /**
     * Inicializa un nuevo chat entre dos usuarios
     * @param id_user1 - ID del primer usuario
     * @param id_user2 - ID del segundo usuario
     * @returns Resultado de la operación
     */
    static async initChat(id_user1: number, id_user2: number) {
        try {
            const { data, error } = await supabase
                .from('chat')
                .insert({
                    id_user1,
                    id_user2,
                    fecha_reciente: new Date().toISOString()
                })
                .select();

            if (error) {
                console.error("Error en ChatRepository.initChat:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error en ChatRepository.initChat:", error);
            throw error;
        }
    }

    /**
     * Retrieves a chat between two users
     * @param id_user1 - ID of the first user
     * @param id_user2 - ID of the second user
     * @returns The chat object if found, otherwise null
     */
    static async getChatByUsers(id_user1: number, id_user2: number) {
        const { data, error } = await supabase
            .from('chat')
            .select('*')
            .or(`and(id_user1.eq.${id_user1},id_user2.eq.${id_user2}),and(id_user1.eq.${id_user2},id_user2.eq.${id_user1})`);

        if (error) {
            console.error("Error en ChatRepository.getChatByUsers:", error);
            throw error;
        }

        return data;
    }

    /**
     * Updates the recent date of a chat
     * @param id_chat - ID of the chat to update
     * @returns Result of the update operation
     */
    static async updateDate(id_chat: number) {
        const { data, error } = await supabase
            .from('chat')
            .update({ fecha_reciente: new Date().toISOString() })
            .eq('id_chat', id_chat)
            .select();

        if (error) {
            console.error("Error en ChatRepository.updateDate:", error);
            throw error;
        }

        return data;
    }

    /**
     * Restores a deleted chat for a user
     * @param id_user - ID of the user restoring the chat
     * @param id_chat - ID of the chat to restore
     * @returns Result of the restore operation
     */
    static async unDeleteChat(id_user: number, id_chat: number) {
        try {
            // Primero obtener el chat para saber qué campo actualizar
            const { data: chat } = await supabase
                .from('chat')
                .select('id_user1, id_user2')
                .eq('id_chat', id_chat)
                .single();

            if (!chat) {
                throw new Error('No se encontró el chat');
            }

            // Determinar qué campo actualizar
            const updateObj: any = {};
            if (chat.id_user1 === id_user) {
                updateObj.eliminado_user1 = false;
            }
            if (chat.id_user2 === id_user) {
                updateObj.eliminado_user2 = false;
            }

            const { data, error } = await supabase
                .from('chat')
                .update(updateObj)
                .eq('id_chat', id_chat)
                .select();

            if (error) {
                console.error("Error en ChatRepository.unDeleteChat:", error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error("Error en ChatRepository.unDeleteChat:", error);
            throw error;
        }
    }
}

export default ChatRepository;