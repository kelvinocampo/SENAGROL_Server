// Repositories/MessageRepository.ts
import supabase from "../Config/configDB";
import Message from "../Dto/Chat/MessageDTO";

class MessageRepository {
    static async createMessage(message: Message) {
        try {
            const { data, error } = await supabase
                .from('mensaje')
                .insert({
                    contenido: message.contenido,
                    tipo: message.tipo,
                    fecha_envio: message.fecha_envio,
                    id_chat: message.id_chat,
                    id_user: message.id_user,
                    editado: message.editado ? 1 : 0
                })
                .select()
                .single();

            if (error) {
                console.error("Error en MessageRepository.createMessage:", error);
                throw error;
            }

            return {
                id_mensaje: data.id_mensaje,
                contenido: data.contenido,
                tipo: data.tipo,
                fecha_envio: data.fecha_envio,
                id_chat: data.id_chat,
                id_user: data.id_user,
                editado: data.editado
            };

        } catch (error) {
            console.error("Error en MessageRepository.createMessage:", error);
            throw error;
        }
    }

    static async updateTextMessage(message: Message, id_message: number) {
        try {
            const { data, error } = await supabase
                .from('mensaje')
                .update({
                    editado: message.editado ? 1 : 0,
                    contenido: message.contenido
                })
                .eq('id_mensaje', id_message)
                .eq('tipo', 'texto')
                .select()
                .single();

            if (error || !data) {
                throw new Error('No se encontró el mensaje de texto para actualizar');
            }

            return { ...message, id_mensaje: id_message };
        } catch (error) {
            console.error("Error en MessageRepository.updateTextMessage:", error);
            throw error;
        }
    }

    static async deleteMessage(id_user: number, id_message: number, id_chat: number) {
        try {
            const { data, error } = await supabase
                .from('mensaje')
                .delete()
                .eq('id_user', id_user)
                .eq('id_mensaje', id_message)
                .eq('id_chat', id_chat)
                .select();

            if (error) {
                console.error("Error en MessageRepository.deleteMessage:", error);
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No se encontró el mensaje para eliminar');
            }

            return { affectedRows: data.length };
        } catch (error) {
            console.error("Error en MessageRepository.deleteMessage:", error);
            throw error;
        }
    }

    static async getMessages(id_chat: number) {
        try {
            const { data, error } = await supabase
                .from('mensaje')
                .select('*')
                .eq('id_chat', id_chat);

            if (error) {
                console.error("Error en MessageRepository.getMessages:", error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error("Error en MessageRepository.getMessages:", error);
            throw error;
        }
    }

    static async getMessageById(id_message: number) {
        try {
            const { data, error } = await supabase
                .from('mensaje')
                .select('*')
                .eq('id_mensaje', id_message);

            if (error) {
                console.error("Error en MessageRepository.getMessages:", error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error("Error en MessageRepository.getMessages:", error);
            throw error;
        }
    }
}

export default MessageRepository;