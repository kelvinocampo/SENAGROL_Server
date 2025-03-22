import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

import IARepository from "../repositories/IARepository";

const { APIKEY = "" } = process.env;

const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "No contestes con formato markdown" }],
        },
        {
            role: "model",
            parts: [{ text: "Bien, entendido." }],
        },
    ],
});

class IAService {
    static async requestRegister(prompt: string, role: string, id: string) {
        try {
            let IAprompt = `Es necesario acceder a la base de datos en base a esta peticion:
            ${prompt},
            Contesta solo "SI" o "NO"`;
            let result = await chat.sendMessage(IAprompt);
            let responseText = result.response.text();

            if (responseText.trim() === "NO") {
                responseText = await IAService.responseIA(prompt);
            } else {
                IAprompt = `Este usuario con el siguiente rol:
                ${role}
                tiene permiso para:
                ${prompt},
                Contesta solo "SI" o "NO"`;
                result = await chat.sendMessage(IAprompt);
                responseText = result.response.text();

                if (responseText.trim() === "NO") {
                    responseText = "El usuario no tiene acceso a lo solicitado.";
                } else {
                    responseText = await IAService.generateSQL(prompt, id);
                }
            }

            return responseText;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al enviar el mensaje:", error.message);
                throw new Error(error.message);
            } else {
                console.error("Error desconocido:", error);
                throw new Error("Ocurrió un error desconocido");
            }
        }
    }

    static async responseIA(prompt: string) {
        try {
            const result = await chat.sendMessage(prompt);
            const responseText = result.response.text();
            return responseText;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al enviar el mensaje:", error.message);
                throw new Error(error.message);
            } else {
                console.error("Error desconocido:", error);
                throw new Error("Ocurrió un error desconocido");
            }
        }
    }

    static async generateSQL(prompt: string, id: string) {
        try {
            let IAprompt =
                `Genera solo la consulta SQL sin formato markdown para la siguiente solicitud: "${prompt}".
                Si necesitas mi id de usuario es ${id}
                Las tablas disponibles son:
                - usuario (id_usuario, nombre, nombre_usuario, correo, contraseña, cara, telefono),
                - comprador (id_comprador),
                - vendedor (id_vendedor),
                - transportador (id_transportador, licencia_conduccion, soat, tarjeta_propiedad_vehiculo, tipo_vehiculo, peso_vehiculo),
                - foto_vehiculo (id_foto_vehiculo, foto, id_transportador),
                - administrador (id_administrador),
                - producto (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, id_vendedor),
                - compra (id_compra, estado, precio_transporte, precio_producto, cantidad, fecha_compra, fecha_entrega, id_producto, id_vendedor, id_comprador, id_transportador),
                - chat (id_chat, bloqueado_por, fecha_reciente, id_user1, id_user2),
                - mensaje (id_mensaje, editado, tipo, contenido, fecha_envio, id_chat, id_user).`;
            let result = await chat.sendMessage(IAprompt);
            let responseText = result.response.text();

            let SQLResponse = await IARepository.querySQL(await IAService.cleanSQLResponse(responseText));

            IAprompt = `Esta es la respuesta de la base de datos:
            ${SQLResponse[0]}.
            Ahora responde la siguiente peticion:
            ${prompt}.`;
            result = await chat.sendMessage(IAprompt);
            responseText = result.response.text();
            return responseText;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error al enviar el mensaje:", error.message);
                throw new Error(error.message);
            } else {
                console.error("Error desconocido:", error);
                throw new Error("Ocurrió un error desconocido");
            }
        }
    }

    static async cleanSQLResponse(response: string) {
        const sqlRegex = /```sql\n([\s\S]*?)\n```/;
        const match = response.match(sqlRegex);

        if (match && match[1]) {
            return match[1].trim();
        }

        return response;
    }
}

export default IAService;