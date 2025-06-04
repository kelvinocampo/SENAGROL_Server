import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { FRONT_ROUTES } from "../Data/FrontRoutes";
import { Info } from "../Data/Info";
import { RequiredRoles } from "../Middleware/VerifyTokenData";
import ProductRepository from "../Repositories/ProductRepository";
import BuyRepository from "../Repositories/BuyRepository";
import { info } from "console";
dotenv.config();

const { APIKEY = "" } = process.env;
const ai = new GoogleGenAI({ apiKey: APIKEY });

// Tipos de respuesta posibles
export type ResponseType = 'GENERAL' | 'BUY' | 'PRODUCT' | 'NAV';

class IAService {
    static async getResponse(prompt: string, history: any[], role: RequiredRoles | "Ninguno" = "Ninguno", id_user: number = 0) {
        try {
            const classifiedResponse: any = await this.classifyResponse(prompt, history, role);
            const response = this.getResponseByType(classifiedResponse, prompt, history, role, id_user);
            return response;
        } catch (error) {
            console.error("Error getting AI response:", error);
            throw new Error("Failed to get AI response");
        }
    }

    static async classifyResponse(prompt: string, history: any[], role: RequiredRoles | "Ninguno") {
        try {
            // Construimos el prompt de clasificación
            const classificationPrompt = `
                Eres un clasificador de consultas para un sistema de comercio electrónico. 
                Clasifica la siguiente consulta del usuario según su tipo y teniendo en cuenta el rol del usuario: ${role}.

                Instrucciones:
                1. Clasifica la consulta en uno de los tipos mencionados
                2. Genera una respuesta breve y útil según el tipo y el rol del usuario
                3. Responde solo con el tipo de respuesta, sin explicaciones adicionales

                Tipos de respuesta:
                - GENERAL: Para consultas sobre el negocio en general (ej. políticas, información de la empresa)
                - PRODUCT: Para consultas sobre productos (ej. características, disponibilidad)
                - BUY: Para consultas relacionadas con compras (ej. estado de pedido)
                - NAV: Para solicitudes de navegación a secciones específicas de la aplicación

                Consulta del usuario: "${prompt}"
                Responde solo con el tipo de respuesta
            `;
            const chat = ai.chats.create({
                model: "gemini-2.0-flash",
                history: history
            });

            const response: any = await chat.sendMessage({
                message: classificationPrompt,
            });

            console.log("Response from classification:", response.text);


            return this.CleanResponse(response.text);
        } catch (error) {
            console.error("Error classifying response:", error);
        }
    }

    static async getResponseByType(classifiedResponse: any, prompt: string, history: any[], role: RequiredRoles | "Ninguno" = "Ninguno", id_user: number = 0) {
        const responseType = classifiedResponse.toUpperCase() as ResponseType;

        switch (responseType) {
            case 'GENERAL':
                return await this.getGeneralResponse(prompt, history);
            case 'BUY':
                return await this.getBuyResponse(prompt, history, id_user);
            case 'PRODUCT':
                return await this.getProductResponse(prompt, history);
            case 'NAV':
                return await this.getNavResponse(prompt, history, role);
            default:
                return "Lo siento, no puedo ayudar con esa consulta.";
        }
    }

    static async getGeneralResponse(prompt: string, history: any[]) {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history: history
        })
        const info = await this.formatObject(Info)

        const generalPrompt = `
            Eres un asistente de IA especializado en comercio electrónico.
            El usuario ha solicitado información general sobre el negocio.

            Información del negocio:
            ${info}

            Consulta del usuario: "${prompt}"

            Instrucciones:
            1. Proporciona información general sobre el negocio
            2. Responde solo con la información relevante
            3. No incluyas información sensible como números de tarjeta de crédito o datos personales o IDs
            4. Responde de manera corta y concisa
        `

        const response: any = await chat.sendMessage({
            message: generalPrompt,
        })

        return this.CleanResponse(response.text);
    }

    static async getBuyResponse(prompt: string, history: any[], id_user: number) {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history: history
        });
        const buys = await BuyRepository.getAllByUserId(id_user);
        const formattedBuys = await this.formatObject(buys);
        const response: any = await chat.sendMessage({
            message: `
                Eres un asistente de IA especializado en comercio electrónico.
                El usuario ha solicitado información sobre su compra.

                Consulta del usuario: "${prompt}"
                ID del usuario: ${id_user}

                Instrucciones:
                1. Proporciona información detallada sobre el estado de la compra
                2. Si el usuario no tiene compras, informa que no se encontraron compras
                3. Responde solo con la información de la compra
                4. Omite las compras que no pertenecen al usuario
                5. Responde en formato markdown para los links ejemplo: [Texto del enlace](URL)
                6. No incluyas información sensible como números de tarjeta de crédito o datos personales o IDs
                7. Responde de manera corta y concisa

                Compras del usuario:
                ${formattedBuys}
            `
        });

        return this.CleanResponse(response.text)
    }

    static async getProductResponse(prompt: string, history: any[]) {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history: history
        });
        const products = await ProductRepository.getAll();
        const formattedProducts = await this.formatObject(products);

        const response: any = await chat.sendMessage({
            message: `
                Eres un asistente de IA especializado en productos de comercio electrónico.
                El usuario ha solicitado información sobre un producto específico.

                Consulta del usuario: "${prompt}"

                Instrucciones:
                1. Proporciona información detallada sobre el producto solicitado
                2. Si el producto no existe, informa que no se encontró el producto
                3. Responde solo con la información del producto
                4. Omite los productos despublicados o eliminados
                5. Responde en formato markdown para los links ejemplo: [Nombre del producto](/Producto/:id_producto)
                6. Proporciona el link del productos siendo la siguiente ruta: /Producto/:id_producto
                7. No incluyas información sensible como números de tarjeta de crédito o datos personales o IDs
                8. Responde de manera corta y concisa
                9. Si es necesario listar, hazlo con el nombre, descripcion , precio y link del producto
                10. Responde en formato markdown para el estilo de la respuesta, ejemplo: **Nombre del producto** - _Descripción del producto_ - $Precio - [Ver producto](/Producto/:id_producto) /n

                Productos disponibles:
                ${formattedProducts}
            `
        });

        return this.CleanResponse(response.text);
    }

    static async getNavResponse(prompt: string, history: any[], role: RequiredRoles | "Ninguno" = "Ninguno") {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history: history
        });
        const routes = await this.formatObject(FRONT_ROUTES);

        const response: any = await chat.sendMessage({
            message: `
                Eres un asistente de navegación para una aplicación web de comercio electrónico.
                El usuario ha solicitado navegar a una sección específica de la aplicación.

                Consulta del usuario: "${prompt}"
                Rol del usuario: ${role}

                Instrucciones:
                1. Identifica la sección a la que el usuario quiere navegar
                2. Proporciona un enlace directo a esa sección
                3. Si el rol del usuario no tiene acceso a esa sección, informa que no tiene permiso
                4. Si el usuario no está autenticado, sugiere que se registre o inicie sesión
                5. Responde solo con el enlace y la respuesta
                6. Si no se puede identificar la sección, informa que no se pudo encontrar la ruta
                7. Si no posee acceso no le muestres la ruta, muesrake donde conseguir el rol necesario
                8. Response en formato markdown para los links ejemplo: [Texto del enlace](URL)

                Rutas de navegacion de la aplicacion: 
                ${routes}
            `
        })

        return this.CleanResponse(response.text);
    }

    static CleanResponse(response: string) {
        return response.replace(/^\s+|\s+$/g, "").replace(/\n/g, " ");
    }

    static async formatObject(object: any) {
        return JSON.stringify(object, null, 2);
    }
}

export default IAService;