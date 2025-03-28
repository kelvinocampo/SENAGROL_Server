"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const IARepository_1 = __importDefault(require("../repositories/IARepository"));
const { APIKEY = "" } = process.env;
const genAI = new generative_ai_1.GoogleGenerativeAI(APIKEY);
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
    static requestRegister(prompt, role, id, history) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const localHistory = [...globalHistory.history, ...history];
                const chat = model.startChat({ history: localHistory });
                let IAprompt = `Es necesario acceder a la base de datos en base a esta petición:
            ${prompt},
            Contesta solo "SI" o "NO"`;
                let result = yield chat.sendMessage(IAprompt);
                let responseText = result.response.text();
                if (responseText.trim() === "NO") {
                    responseText = yield IAService.responseIA(prompt, history);
                }
                else {
                    IAprompt = `Este usuario con el siguiente rol:
                ${role}
                ¿tiene permiso para acceder a lo solicitado:
                ${prompt} ?,
                Contesta solo "SI" o "NO"`;
                    result = yield chat.sendMessage(IAprompt);
                    responseText = result.response.text();
                    console.log(responseText, IAprompt);
                    if (responseText.trim() === "NO") {
                        responseText = "El usuario no tiene acceso a lo solicitado.";
                    }
                    else {
                        responseText = yield IAService.generateSQL(prompt, id, chat);
                    }
                }
                return responseText;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error al enviar el mensaje:", error.message);
                    throw new Error(error.message);
                }
                else {
                    console.error("Error desconocido:", error);
                    throw new Error("Ocurrió un error desconocido");
                }
            }
        });
    }
    static responseIA(prompt, history) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const localHistory = [...globalHistory.history, ...history];
                const chat = model.startChat({ history: localHistory });
                const result = yield chat.sendMessage(prompt);
                const responseText = result.response.text();
                return responseText;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error al enviar el mensaje:", error.message);
                    throw new Error(error.message);
                }
                else {
                    console.error("Error desconocido:", error);
                    throw new Error("Ocurrió un error desconocido");
                }
            }
        });
    }
    static generateSQL(prompt, id, chat) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Paso 1: Generar la consulta SQL
                let IAprompt = `Genera solo la consulta SQL sin formato markdown para la siguiente solicitud: "${prompt}".
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
                let result = yield chat.sendMessage(IAprompt);
                let responseText = result.response.text();
                // Paso 2: Ejecutar la consulta SQL en la base de datos
                const SQLResponse = yield IARepository_1.default.querySQL(yield IAService.cleanSQLResponse(responseText));
                // Paso 3: Formatear el resultado de la consulta
                const formattedResults = IAService.formatSQLResponse(SQLResponse);
                // Paso 4: Enviar el resultado formateado a la IA junto con la solicitud original
                IAprompt = `Esta es la respuesta de la base de datos:
            ${formattedResults}.
            Ahora responde la siguiente petición:
            ${prompt}.`;
                result = yield chat.sendMessage(IAprompt);
                responseText = result.response.text();
                // Paso 5: Devolver la respuesta de la IA
                return responseText;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Error al enviar el mensaje:", error.message);
                    throw new Error(error.message);
                }
                else {
                    console.error("Error desconocido:", error);
                    throw new Error("Ocurrió un error desconocido");
                }
            }
        });
    }
    static cleanSQLResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlRegex = /```sql\n([\s\S]*?)\n```/;
            const match = response.match(sqlRegex);
            if (match && match[1]) {
                return match[1].trim();
            }
            return response;
        });
    }
    static formatSQLResponse(results) {
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
exports.default = IAService;
