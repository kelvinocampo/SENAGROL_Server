import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { FRONT_ROUTES } from "../Data/FrontRoutes";
import { Info } from "../Data/Info";
import { RequiredRoles } from "../Middleware/VerifyTokenData";
import ProductRepository from "../Repositories/ProductRepository";
import BuyRepository, { TypeOwner } from "../Repositories/BuyRepository";
dotenv.config();

const { APIKEY = "" } = process.env;
const ai = new GoogleGenAI({ apiKey: APIKEY });

// Tipos de datos que la IA puede necesitar
export type DataRequirement = {
    needsProducts: boolean;
    needsBuys: boolean;
    needsRoutes: boolean;
    responseType: 'GENERAL' | 'BUY' | 'PRODUCT' | 'NAV';
};

class IAService {
    static async getResponse(prompt: string, history: any[], role: RequiredRoles | "Ninguno" = "Ninguno", id_user: number = 0) {
        try {
            // Primero determinamos qué datos necesitamos
            const dataRequirement = await this.analyzeDataRequirements(prompt, role);
            
            // Obtenemos solo los datos necesarios
            const contextData = await this.gatherRequiredData(dataRequirement, id_user, role);
            
            // Generamos la respuesta con un solo prompt unificado
            const response = await this.generateUnifiedResponse(prompt, history, role, id_user, dataRequirement, contextData);
            
            return response;
        } catch (error) {
            console.error("Error getting AI response:", error);
            throw new Error("Failed to get AI response");
        }
    }

    static async analyzeDataRequirements(prompt: string, role: RequiredRoles | "Ninguno"): Promise<DataRequirement> {
        try {
            const analysisPrompt = `
                Analiza la siguiente consulta y determina qué tipo de datos necesitas para responder correctamente.
                
                Consulta: "${prompt}"
                Rol del usuario: ${role}
                
                Responde ÚNICAMENTE con un JSON válido sin formato markdown, sin ${"```json ni ```"}. 
                El JSON debe estar en formato plano como este ejemplo:
                {"needsProducts": true, "needsBuys": false, "needsRoutes": false, "responseType": "PRODUCT"}
                
                Estructura requerida:
                {
                    "needsProducts": boolean,
                    "needsBuys": boolean,
                    "needsRoutes": boolean,
                    "responseType": "GENERAL" | "BUY" | "PRODUCT" | "NAV"
                }
                
                Criterios:
                - needsProducts: true si la consulta menciona productos, precios, stock, catálogo, inventario
                - needsBuys: true si la consulta menciona compras, ventas, transportes, pedidos, historial de transacciones (requiere usuario autenticado)
                - needsRoutes: true si la consulta pide navegar, ir a una sección, abrir una página
                - responseType: clasifica el tipo principal de respuesta necesaria
                
                Ejemplos:
                - "¿Qué productos tienes?" → {"needsProducts": true, "needsBuys": false, "needsRoutes": false, "responseType": "PRODUCT"}
                - "Mis compras del mes pasado" → {"needsProducts": false, "needsBuys": true, "needsRoutes": false, "responseType": "BUY"}
                - "Llévame al catálogo" → {"needsProducts": false, "needsBuys": false, "needsRoutes": true, "responseType": "NAV"}
                - "¿Cuánto costó mi última compra de tomates?" → {"needsProducts": true, "needsBuys": true, "needsRoutes": false, "responseType": "BUY"}
            `;

            const chat = ai.chats.create({
                model: "gemini-2.0-flash",
                history: []
            });

            const response: any = await chat.sendMessage({
                message: analysisPrompt,
            });

            const cleanedResponse = this.extractAndCleanJSON(response.text);
            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("Error analyzing data requirements:", error);
            // Fallback seguro
            return {
                needsProducts: false,
                needsBuys: false,
                needsRoutes: false,
                responseType: 'GENERAL'
            };
        }
    }

    static async gatherRequiredData(dataRequirement: DataRequirement, id_user: number, role: RequiredRoles | "Ninguno") {
        const contextData: any = {
            info: await this.formatObject(Info)  // Siempre incluimos info general
        };

        // Obtenemos productos solo si son necesarios
        if (dataRequirement.needsProducts) {
            try {
                const products = await ProductRepository.getAll();
                contextData.products = await this.formatObject(products);
            } catch (error) {
                console.error("Error fetching products:", error);
                contextData.products = "[]";
            }
        }

        // Obtenemos compras solo si son necesarias y el usuario está autenticado
        if (dataRequirement.needsBuys && role !== "Ninguno" && id_user > 0) {
            try {
                const buys = await BuyRepository.getByOwner(id_user, role as TypeOwner);
                contextData.buys = await this.formatObject(buys);
                contextData.buyLabel = role == "vendedor" ? "Ventas" : role == "transportador" ? "Transportes" : "Compras";
            } catch (error) {
                console.error("Error fetching buys:", error);
                contextData.buys = "[]";
            }
        }

        // Obtenemos rutas solo si son necesarias
        if (dataRequirement.needsRoutes) {
            contextData.routes = await this.formatObject(FRONT_ROUTES);
        }

        return contextData;
    }

    static async generateUnifiedResponse(
        prompt: string, 
        history: any[], 
        role: RequiredRoles | "Ninguno", 
        id_user: number,
        dataRequirement: DataRequirement,
        contextData: any
    ) {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history: history
        });

        const unifiedPrompt = `
            Eres un asistente de IA especializado en comercio electrónico. Responde a la consulta del usuario de manera precisa y útil.

            INFORMACIÓN DEL CONTEXTO:
            - Consulta del usuario: "${prompt}"
            - Rol del usuario: ${role}
            - ID del usuario: ${id_user}
            - Tipo de respuesta requerido: ${dataRequirement.responseType}

            DATOS DISPONIBLES:
            ${contextData.info ? `Información general del negocio:\n${contextData.info}\n` : ''}
            ${contextData.products ? `Productos disponibles:\n${contextData.products}\n` : ''}
            ${contextData.buys ? `${contextData.buyLabel} del usuario:\n${contextData.buys}\n` : ''}
            ${contextData.routes ? `Rutas de navegación:\n${contextData.routes}\n` : ''}

            INSTRUCCIONES ESPECÍFICAS SEGÚN EL TIPO DE RESPUESTA:

            ${dataRequirement.responseType === 'PRODUCT' ? `
            PARA CONSULTAS DE PRODUCTOS:
            - Proporciona información detallada de los productos solicitados
            - Omite productos despublicados o eliminados
            - Usa formato markdown: [Nombre del producto](/Producto/:id_producto)
            - Si necesitas listar, incluye: nombre, descripción, precio y link
            - Evalúa si necesitas gráficos según la consulta:
              * Barras: para comparar valores entre productos
              * Líneas: para tendencias temporales
              * Pie: para proporciones (máximo 5 elementos)
              * Area: para acumulación de valores
            ` : ''}

            ${dataRequirement.responseType === 'BUY' ? `
            PARA CONSULTAS DE COMPRAS/VENTAS/TRANSPORTES:
            - Proporciona información detallada sobre ${contextData.buyLabel || 'transacciones'}
            - Si no hay datos, informa que no se encontraron ${contextData.buyLabel || 'transacciones'}
            - Evalúa si la consulta requiere gráficos:
              * Líneas: para tendencias temporales con fechas y montos
              * Barras: para comparar montos entre categorías
              * Pie: para distribución por estado (máximo 5 estados)
              * Dispersión: para relación cantidad-precio
            - El monto total = precio_producto + precio_transporte
            ` : ''}

            ${dataRequirement.responseType === 'NAV' ? `
            PARA NAVEGACIÓN:
            - Identifica la sección solicitada y proporciona el enlace directo
            - Si el rol no tiene acceso, informa dónde conseguir el rol necesario (no muestres la ruta)
            - Si no está autenticado, sugiere registro/login
            - Usa formato markdown: [Texto del enlace](URL)
            ` : ''}

            ${dataRequirement.responseType === 'GENERAL' ? `
            PARA CONSULTAS GENERALES:
            - Proporciona información general del negocio
            - Responde de manera corta y concisa
            ` : ''}

            FORMATO DE GRÁFICOS (si es necesario):
            Si determinas que se necesita un gráfico, úsalo entre [CHART] y [/CHART] en formato JSON:
            {
                "data": [
                    {"campo1": "valor1", "campo2": valor2, ...},
                    {...}
                ],
                "options": {
                    "chartType": "bar" | "line" | "pie" | "area" | "scatter",
                    "xKey": "campo_x",
                    "yKeys": ["campo_y1", "campo_y2"],
                    "colors": ["#color1", "#color2"],
                    "xLabel": "Etiqueta X",
                    "yLabel": "Etiqueta Y",
                    "stacked": true/false,
                    "radius": number
                }
            }

            REGLAS GENERALES:
            - NO incluyas información sensible (IDs, tarjetas de crédito, datos personales)
            - Usa formato markdown para estilo y enlaces
            - Responde de manera concisa pero completa
            - Si no puedes responder algo, explícalo brevemente

            Responde ahora a la consulta del usuario.
        `;

        const response: any = await chat.sendMessage({
            message: unifiedPrompt,
        });

        return this.CleanResponse(response.text);
    }

    static extractAndCleanJSON(response: string): string {
        // Remover bloques de código markdown ```json ... ```
        let cleaned = response.replace(/```json\s*/gi, '').replace(/```/g, '');
        
        // Remover espacios y saltos de línea al inicio y final
        cleaned = cleaned.trim();
        
        // Buscar el primer { y el último } para extraer solo el JSON
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        
        return cleaned;
    }

    static CleanResponse(response: string) {
        return response.replace(/^\s+|\s+$/g, "").replace(/\n/g, " ");
    }

    static async formatObject(object: any) {
        return JSON.stringify(object, null, 2);
    }
}

export default IAService;