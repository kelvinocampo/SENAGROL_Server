import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

import IARepository from "../repositories/IARepository";

const { APIKEY = "" } = process.env;

const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const globalHistory = {
    history: [
        {
            role: "user",
            parts: [{ text: "No contestes con formato markdown, ejemplo(/n, --, ```)." }],
        },
        {
            role: "model",
            parts: [{ text: "Bien, entendido." }],
        },
    ],
};

class IAService {
    static async requestRegister(prompt: string, role: string, id: string, history: any[]) {
        try {
            const localHistory = [...globalHistory.history, ...history];

            const chat = model.startChat({ history: localHistory });

            let IAprompt = `Es necesario acceder a la base de datos en base a esta petición:
            ${prompt},
            Contesta solo "SI" o "NO"`;
            let result = await chat.sendMessage(IAprompt);
            let responseText = result.response.text();

            if (responseText.trim() === "NO") {
                responseText = await IAService.responseIA(prompt, history);
            } else {
                IAprompt = `Este usuario con el siguiente rol:
                ${role}
                ¿tiene permiso para acceder a lo solicitado:
                ${prompt} ?,
                Contesta solo "SI" o "NO"`;
                result = await chat.sendMessage(IAprompt);
                responseText = result.response.text();

                console.log(responseText,IAprompt);
                

                if (responseText.trim() === "NO") {
                    responseText = "El usuario no tiene acceso a lo solicitado.";
                } else {
                    responseText = await IAService.generateSQL(prompt, id, chat);
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

    static async responseIA(prompt: string, history: any[]) {
        try {
            const localHistory = [...globalHistory.history, ...history];

            const chat = model.startChat({ history: localHistory });

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

    static async generateSQL(prompt: string, id: string, chat: any) {
        try {
            // Paso 1: Generar la consulta SQL
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

            // Paso 2: Ejecutar la consulta SQL en la base de datos
            const SQLResponse = await IARepository.querySQL(await IAService.cleanSQLResponse(responseText));

            // Paso 3: Formatear el resultado de la consulta
            const formattedResults = IAService.formatSQLResponse(SQLResponse);

            // Paso 4: Enviar el resultado formateado a la IA junto con la solicitud original
            IAprompt = `Esta es la respuesta de la base de datos:
            ${formattedResults}.
            Ahora responde la siguiente petición:
            ${prompt}.`;
            result = await chat.sendMessage(IAprompt);
            responseText = result.response.text();

            // Paso 5: Devolver la respuesta de la IA
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

    static formatSQLResponse(results: any[]): string {
        if (results.length === 0) {
            return "No se encontraron resultados.";
        }

        // Convertir cada fila en una cadena legible
        const formattedResults = results.map((row, index) => {
            return `Fila ${index + 1}: ${JSON.stringify(row)}`;
        }).join("\n");

        return formattedResults;
    }
}

export default IAService;