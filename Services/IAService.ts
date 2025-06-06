import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { FRONT_ROUTES } from "../Data/FrontRoutes";
import { Info } from "../Data/Info";
import { RequiredRoles } from "../Middleware/VerifyTokenData";
import ProductRepository from "../Repositories/ProductRepository";
import BuyRepository from "../Repositories/BuyRepository";
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
            console.log(role);
            
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
                - PRODUCT: Para consultas sobre productos
                - BUY: Para consultas sobre compras (Acceso exclusivo para compradores)
                - NAV: Para solicitudes de navegación a secciones específicas de la aplicación (Consideralo como ultimo recurso)

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
                El usuario ha solicitado información sobre sus compras.

                Consulta del usuario: "${prompt}"
                ID del usuario: ${id_user}

                Instrucciones:
                1. Proporciona información detallada sobre las compras del usuario
                2. Si el usuario no tiene compras, informa que no se encontraron compras
                3. Responde en formato markdown para los links ejemplo: [Texto del enlace](URL)
                4. No incluyas información sensible como IDs
                5. Organiza la información por: estado, fecha, producto, vendedor, transportador y monto total (precio_producto + precio_transporte)
                6. Evalua si la consulta del usuario requiere solo una gráfica y si es así, inclúyelo siguiendo estas reglas:
                    - Para tendencias de compras en el tiempo: gráfico de líneas (usar fecha_compra)
                    - Para comparar montos entre compras: gráfico de barras
                    - Para distribución por estado: gráfico de pie (solo si hay menos de 5 estados)
                    - Para relación entre cantidad y precio: gráfico de dispersión
                7. Para gráficos, sigue el formato entre [CHART] y [/CHART] en JSON con esta estructura de ejemplo:
                {
                    "data": [
                        {
                            "fecha": "2023-01-15",
                            "monto_total": 150.50,
                            "estado": "completado",
                            "producto": "Producto A",
                            "cantidad": 2
                        },
                        {...}
                    ],
                    "options": {
                        "chartType": "bar" | "line" | "pie" | "area",
                        "xKey": "fecha",
                        "yKeys": ["monto_total"],
                        "colors": ["#FF0000"],
                        "xLabel": "Fecha",
                        "yLabel": "Monto ($)",
                        "stacked": false
                    }
                }

                Posibles gráficos según los datos disponibles:
                - Evolución de compras: línea temporal con fechas y montos
                - Distribución por estado: gráfico de pie (completado, pendiente, cancelado)
                - Relación cantidad-precio: gráfico de dispersión
                - Comparación de montos por vendedor: gráfico de barras

                Datos de compras del usuario:
                ${formattedBuys}

                Notas importantes:
                - El monto total se calcula como: precio_producto + precio_transporte
                - Para gráficos de tiempo, usa fecha_compra como eje X
                - Para estado, usa los valores: completado, pendiente, cancelado
                - Los nombres de productos están en producto_nombre
                - Los nombres de vendedores están en vendedor_nombre
            `
        });

        return this.CleanResponse(response.text);
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
            10. Responde en formato markdown para el estilo de la respuesta, ejemplo: /n, **Texto**, __Texto__, - Texto, etc.
            11. Evalua el tipo de grafica a utilizar según la información proporcionada y el contexto de la consulta del usuario, ejemplo: 
                - Para grandes cantidades utiliza un gráfico de barras.
                - Para mostrar tendencias a lo largo del tiempo, utiliza un gráfico de líneas.
                - Para mostrar proporciones o porcentajes, utiliza un gráfico de pie.
                - No usar pie para más de 5 elementos.
            12. Si es requerido o necesario, inserta solo una gráfica siguiendo el siguiente formato:
            13. Devuelve TODA la configuración necesaria entre [CHART] y [/CHART] en formato JSON:
                {
                    "data": [
                        {"producto": "Tomate", "precio": 11, "stock": 200},
                        {...}
                    ],
                    "options": {
                        "chartType": "bar" | "line" | "pie" | "area",
                        "xKey": "producto",
                        "yKeys": ["precio", "stock"],
                        "colors": ["#FF0000", "#00FF00"],
                        "xLabel": "Productos",
                        "yLabel": "Cantidad",
                        "stacked": true/false (opcional para barras),
                        "radius": number (opcional para gráficos de pie)
                    }
                }

            Reglas para seleccionar el tipo de gráfico:
            - Usa 'bar' para comparar valores entre categorías
            - Usa 'line' para mostrar tendencias en el tiempo
            - Usa 'pie' para mostrar proporciones o porcentajes
            - Usa 'area' para mostrar acumulación de valores
            - Usa 'scatter' para correlaciones entre dos variables

            Ejemplo completo:
            [CHART]
            {
                "data": [
                    {"producto": "Tomate", "precio": 11, "stock": 200},
                    {"producto": "Lechuga", "precio": 5, "stock": 150}
                ],
                "options": {
                    "chartType": "bar",
                    "xKey": "producto",
                    "yKeys": ["precio", "stock"],
                    "colors": ["#FF5733", "#33FF57"],
                    "xLabel": "Productos",
                    "yLabel": "Cantidad",
                    "stacked": true
                }
            }
            [/CHART]

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