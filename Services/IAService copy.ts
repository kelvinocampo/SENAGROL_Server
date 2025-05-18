import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import IARepository from "../Repositories/IARepository";
dotenv.config();

const { APIKEY = "" } = process.env;
const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const globalHistory = {
    history: [
        {
            role: "user",
            parts: [{
                text: `No contestes con formato markdown. 
                Solo puedes ayudar con tres funcionalidades específicas si el usuario se encuentra identificado si no no se puede acceder a las funcionalidades:
                1. GESTIÓN DE PRODUCTOS (crear, actualizar, eliminar productos) para el rol de vendedor siendo, si quiere creacion o edicion devuelve las rutas del front siendo "MisProductos/Crear" o "MisProductos/Editar/:id_producto" consiguinedo la id para esta ultima y para la eliminacion manejalo por el estado logico del campo booleano "eliminado"
                2. CONSULTA DE COMPRAS Y PRODUCTOS (ver información de productos y compras) para los participes de una compra
                3. DESPUBLICACIÓN Y PUBLICACIÓN DE PRODUCTOS (cambiar estado de visibilidad) para administradores
                En caso de no que no poseas la informacion suficiente pide al usuario la informacion requerida.
                Ademas de estas acciones no hay otras razones para acceder a la base de datos.
                Si te piden algo fuera de estas áreas, responde educadamente que no puedes ayudar con esa solicitud.`
            }],
        },
        {
            role: "model",
            parts: [{ text: "Entendido. Solo ayudaré con gestión de productos, consulta de compras y productos, y despublicación/publicación de productos." }],
        },
    ],
};

class IAService {
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

    static async requestRegister(prompt: string, role: string, id: string, history: any[]) {
        try {
            const localHistory = [...globalHistory.history, ...history];
            const chat = model.startChat({ history: localHistory });

            // Primero verificar si necesita redirección a rutas del frontend
            let IAprompt = `
                Analiza esta solicitud del usuario: "${prompt}"
                Usuario rol: ${role}
                
                ¿Esta solicitud requiere redirección a una ruta del frontend?
                - Si es creación de producto para vendedor: responde "CREAR_PRODUCTO"
                - Si es edición de producto para vendedor: responde "EDITAR_PRODUCTO"
                - Si es otra operación: responde "PROCESAR_NORMAL"
                
                Contesta solo una de estas tres opciones.
            `;

            let result = await chat.sendMessage(IAprompt);
            let routeCheck = result.response.text().trim();

            // Manejar redirecciones a frontend
            if (routeCheck === "CREAR_PRODUCTO" && role.toLowerCase().includes('vendedor')) {
                return "Para crear un nuevo producto, dirígete a: MisProductos/Crear";
            } else if (routeCheck === "EDITAR_PRODUCTO" && role.toLowerCase().includes('vendedor')) {
                // Buscar el ID del producto a editar
                const productId = await IAService.extractProductId(prompt, id, chat);
                if (productId) {
                    return `Para editar este producto, dirígete a: MisProductos/Editar/${productId}`;
                } else {
                    return "Por favor especifica qué producto deseas editar.";
                }
            }

            // Procesar normalmente si no es redirección
            IAprompt = `
                ¿Es necesario acceder a la base de datos para cumplir con esta peticion?:
                ${prompt},
                Contesta solo "SI" o "NO"
            `;
            result = await chat.sendMessage(IAprompt);
            let responseText = result.response.text();

            if (responseText.trim() === "NO") {
                responseText = await IAService.responseIA(prompt, history);
            } else {
                IAprompt = `
                    El usuario posee estos roles: ${role}
                    ¿tiene permiso para acceder a lo solicitado?: ${prompt}.
                    Contesta solo "SI" o "NO"
                `;
                result = await chat.sendMessage(IAprompt);
                responseText = result.response.text();
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

    static async extractProductId(prompt: string, userId: string, chat: any) {
        try {
            // Intentar extraer ID del prompt directamente
            const idMatch = prompt.match(/\b(\d+)\b/);
            if (idMatch) {
                return idMatch[1];
            }

            // Si no hay ID explícito, buscar por nombre de producto
            let IAprompt = `
                Genera una consulta SQL para encontrar el ID del producto que el usuario quiere editar.
                Solicitud: "${prompt}"
                ID del vendedor: ${userId}
                
                Esquema de tabla producto: (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                
                La consulta debe buscar productos del vendedor que coincidan con la descripción en el prompt.
                Genera solo la consulta SQL sin formato markdown.
            `;

            let result = await chat.sendMessage(IAprompt);
            let sqlQuery = result.response.text();

            // Ejecutar la consulta
            const cleanedSQL = await IAService.cleanSQLResponse(sqlQuery);
            const sqlResponse: any = await IARepository.querySQL(cleanedSQL);

            if (sqlResponse && sqlResponse.length > 0) {
                return sqlResponse[0].id_producto;
            }

            return null;
        } catch (error) {
            console.error("Error al extraer ID del producto:", error);
            return null;
        }
    }

    static async generateSQL(prompt: string, id: string, chat: any) {
        try {
            // Verificar si es eliminación lógica de producto
            let IAprompt = `
                Analiza esta solicitud: "${prompt}"
                ¿Se trata de eliminar un producto? 
                Contesta solo "SI" o "NO"
            `;

            let result = await chat.sendMessage(IAprompt);
            let isDelete = result.response.text().trim();

            if (isDelete === "SI") {
                // Manejar eliminación lógica
                IAprompt = `
                    Genera una consulta SQL UPDATE para marcar un producto como eliminado (campo eliminado = 1).
                    Solicitud: "${prompt}"
                    ID del vendedor: ${id}
                    
                    Esquema producto: (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                    
                    La consulta debe actualizar el campo 'eliminado' a 1 para el producto especificado que pertenezca al vendedor.
                    Genera solo la consulta SQL sin formato markdown.
                `;
            } else {
                // Paso 1: Generar la consulta SQL normal
                IAprompt = `
                    Genera solo la consulta SQL sin formato markdown para la siguiente solicitud: "${prompt}".
                    Tu ID de usuario es: ${id}
                    Esquema de base de datos:
                    - usuario (id_usuario, nombre, nombre_usuario, correo, telefono)
                    - vendedor (id_vendedor(Igual a la id_usuario de la tabla usuario ya existente), estado("Pendiente", "Activo"))
                    - comprador (id_comprador(Igual a la id_usuario de la tabla usuario ya existente), estado("Pendiente", "Activo"))
                    - transportador (id_transportador(Igual a la id_usuario de la tabla usuario ya existente), licencia_conduccion, soat, estado("Pendiente", "Activo"))
                    - administrador (id_administrador(Igual a la id_usuario de la tabla usuario ya existente), estado("Pendiente", "Activo"))
                    - producto (id_producto, nombre(No editable), descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                    - compra (id_compra, estado("Pendiente", "Asignada", "En Proceso", "Completada"), precio_transporte(Solo en "Asignada" en adelante), precio_producto, cantidad, fecha_compra, fecha_entrega, id_producto, COALESCE(id_vendedor, nombre_vendedor_eliminado), COALESCE(id_comprador, nombre_comprador_eliminado), COALESCE(id_transportador, nombre_transportador_eliminado) (Solo en "Asignada" en adelante))
                `;
            }

            result = await chat.sendMessage(IAprompt);
            let responseText = result.response.text();
            console.log(responseText);

            // Paso 2: Ejecutar la consulta SQL en la base de datos
            const SQLResponse: any = await IARepository.querySQL(await IAService.cleanSQLResponse(responseText));

            // Paso 3: Formatear el resultado de la consulta
            const formattedResults = IAService.formatSQLResponse(SQLResponse);

            // Paso 4: Enviar el resultado formateado a la IA junto con la solicitud original
            IAprompt = `
                Esta es la respuesta de la base de datos:
                ${formattedResults}.
                Ahora responde la siguiente petición:
                ${prompt}.
                
                Si fue una operación de eliminación exitosa, menciona que el producto ha sido eliminado lógicamente.
            `;
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