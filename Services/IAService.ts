import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import IARepository from "../Repositories/IARepository";
dotenv.config();

const { APIKEY = "" } = process.env;
const genAI = new GoogleGenerativeAI(APIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Configuración de rutas disponibles
const AVAILABLE_ROUTES = {
    // Rutas generales
    login: "/login",
    register: "/register",
    
    // Rutas de vendedor
    productos_crear: "MisProductos/Crear",
    productos_editar: "MisProductos/Editar/:id_producto",
    productos_lista: "MisProductos",
    
    // Rutas de administrador
    admin: "/admin",
    admin_productos: "/admin/productos",
    
    // Rutas adicionales (agregar aquí manualmente)
    perfil: "/perfil",
    configuracion: "/configuracion",
    // ejemplo: historial: "/historial",
};

// Tipos de operaciones que requieren acceso a la base de datos
const DB_OPERATIONS = {
    CONSULTA: "consulta",        // SELECT - Ver información
    ELIMINACION: "eliminacion",  // UPDATE (borrado lógico)
    PUBLICACION: "publicacion",  // UPDATE (despublicar/publicar)
};

const globalHistory = {
    history: [
        {
            role: "user",
            parts: [{
                text: `No contestes con formato markdown. 
                Solo puedes ayudar con tres funcionalidades específicas si el usuario se encuentra identificado:
                1. GESTIÓN DE PRODUCTOS (crear, actualizar, eliminar productos) para el rol de vendedor
                   - Creación/edición: redirigir a rutas del frontend
                   - Eliminación: manejar por estado lógico del campo "eliminado"
                2. CONSULTA DE COMPRAS Y PRODUCTOS (ver información de productos y compras) para los participantes de una compra
                3. DESPUBLICACIÓN Y PUBLICACIÓN DE PRODUCTOS (cambiar estado de visibilidad) para administradores
                4. NAVEGACIÓN - Sugerir rutas como /login, /register, /admin cuando sea apropiado
                
                Si no tienes suficiente información, pide al usuario la información requerida.
                Si te piden algo fuera de estas áreas, responde educadamente que no puedes ayudar con esa solicitud.`
            }],
        },
        {
            role: "model",
            parts: [{ text: "Entendido. Solo ayudaré con gestión de productos, consulta de compras y productos, despublicación/publicación de productos, y navegación cuando sea apropiado." }],
        },
    ],
};

class IAService {
    // Método principal para manejar respuestas sin acceso a DB
    static async responseIA(prompt: string, history: any[]) {
        try {
            const localHistory = [...globalHistory.history, ...history];
            const chat = model.startChat({ history: localHistory });
            const result = await chat.sendMessage(prompt);
            const responseText = result.response.text();
            return responseText;
        } catch (error) {
            console.error("Error en responseIA:", error);
            throw new Error(error instanceof Error ? error.message : "Error desconocido");
        }
    }

    // Método principal para procesar solicitudes
    static async requestRegister(prompt: string, role: string, id: string, history: any[]) {
        try {
            const localHistory = [...globalHistory.history, ...history];
            const chat = model.startChat({ history: localHistory });

            // 1. Analizar el tipo de solicitud
            const requestType = await this.analyzeRequestType(prompt, role, chat);
            
            // 2. Manejar según el tipo de solicitud
            switch (requestType.action) {
                case 'ROUTE_REDIRECT':
                    return this.handleRouteRedirect(requestType, prompt, role, id, chat);
                
                case 'DATABASE_OPERATION':
                    return this.handleDatabaseOperation(prompt, role, id, chat);
                
                case 'PERMISSION_DENIED':
                    return this.buildPermissionDeniedResponse(role, prompt);
                
                case 'SIMPLE_RESPONSE':
                default:
                    return this.responseIA(prompt, history);
            }
        } catch (error) {
            console.error("Error en requestRegister:", error);
            throw new Error(error instanceof Error ? error.message : "Error desconocido");
        }
    }

    // Analizar el tipo de solicitud y determinar la acción necesaria
    static async analyzeRequestType(prompt: string, role: string, chat: any) {
        try {
            const analysisPrompt = `
                Analiza esta solicitud del usuario: "${prompt}"
                Usuario rol: ${role}
                
                Determina qué tipo de acción se necesita:
                1. "CREAR_PRODUCTO" - Si quiere crear un nuevo producto (solo vendedores)
                2. "EDITAR_PRODUCTO" - Si quiere editar un producto existente (solo vendedores)
                3. "LOGIN_REDIRECT" - Si necesita iniciar sesión
                4. "REGISTER_REDIRECT" - Si necesita registrarse
                5. "ADMIN_REDIRECT" - Si necesita acceder al panel de administrador
                6. "CONSULTA_DB" - Si necesita consultar información de productos/compras
                7. "ELIMINAR_PRODUCTO" - Si quiere eliminar un producto (solo vendedores)
                8. "PUBLICAR_DESPUBLICAR" - Si quiere cambiar visibilidad de productos (solo admin)
                9. "SIN_PERMISOS" - Si no tiene permisos para la acción solicitada
                10. "RESPUESTA_SIMPLE" - Si no requiere acceso a DB ni redirección
                
                Responde SOLO una de estas opciones.
            `;

            const result = await chat.sendMessage(analysisPrompt);
            const actionType = result.response.text().trim();

            // Mapear la respuesta a categorías principales
            if (['CREAR_PRODUCTO', 'EDITAR_PRODUCTO', 'LOGIN_REDIRECT', 'REGISTER_REDIRECT', 'ADMIN_REDIRECT'].includes(actionType)) {
                return { action: 'ROUTE_REDIRECT', type: actionType };
            } else if (['CONSULTA_DB', 'ELIMINAR_PRODUCTO', 'PUBLICAR_DESPUBLICAR'].includes(actionType)) {
                return { action: 'DATABASE_OPERATION', type: actionType };
            } else if (actionType === 'SIN_PERMISOS') {
                return { action: 'PERMISSION_DENIED', type: actionType };
            } else {
                return { action: 'SIMPLE_RESPONSE', type: actionType };
            }
        } catch (error) {
            console.error("Error en analyzeRequestType:", error);
            return { action: 'SIMPLE_RESPONSE', type: 'ERROR' };
        }
    }

    // Manejar redirecciones a rutas del frontend
    static async handleRouteRedirect(requestType: any, prompt: string, role: string, id: string, chat: any) {
        try {
            switch (requestType.type) {
                case 'CREAR_PRODUCTO':
                    if (this.hasRole(role, 'vendedor')) {
                        return `Para crear un nuevo producto, dirígete a: ${AVAILABLE_ROUTES.productos_crear}`;
                    } else {
                        return `Solo los vendedores pueden crear productos. ¿Necesitas registrarte como vendedor en ${AVAILABLE_ROUTES.register}?`;
                    }

                case 'EDITAR_PRODUCTO':
                    if (this.hasRole(role, 'vendedor')) {
                        const productId = await this.extractProductId(prompt, id, chat);
                        if (productId) {
                            return `Para editar este producto, dirígete a: ${AVAILABLE_ROUTES.productos_editar.replace(':id_producto', productId)}`;
                        } else {
                            return `Por favor especifica qué producto deseas editar. También puedes ver todos tus productos en: ${AVAILABLE_ROUTES.productos_lista}`;
                        }
                    } else {
                        return `Solo los vendedores pueden editar productos. ¿Necesitas iniciar sesión como vendedor en ${AVAILABLE_ROUTES.login}?`;
                    }

                case 'LOGIN_REDIRECT':
                    return `Para iniciar sesión, dirígete a: ${AVAILABLE_ROUTES.login}`;

                case 'REGISTER_REDIRECT':
                    return `Para registrarte, dirígete a: ${AVAILABLE_ROUTES.register}`;

                case 'ADMIN_REDIRECT':
                    if (this.hasRole(role, 'administrador')) {
                        return `Para acceder al panel de administrador, dirígete a: ${AVAILABLE_ROUTES.admin}`;
                    } else {
                        return `Solo los administradores pueden acceder a esta sección. ¿Necesitas iniciar sesión como administrador en ${AVAILABLE_ROUTES.login}?`;
                    }

                default:
                    return "No se pudo determinar la ruta apropiada para tu solicitud.";
            }
        } catch (error) {
            console.error("Error en handleRouteRedirect:", error);
            return "Error al procesar la redirección.";
        }
    }

    // Manejar operaciones que requieren acceso a la base de datos
    static async handleDatabaseOperation(prompt: string, role: string, id: string, chat: any) {
        try {
            // Verificar permisos antes de acceder a la DB
            const hasPermission = await this.checkPermissions(prompt, role, chat);
            
            if (!hasPermission) {
                return this.buildPermissionDeniedResponse(role, prompt);
            }

            // Proceder con la operación de base de datos
            return await this.generateSQL(prompt, id, chat);
        } catch (error) {
            console.error("Error en handleDatabaseOperation:", error);
            return "Error al procesar la operación en la base de datos.";
        }
    }

    // Verificar permisos del usuario
    static async checkPermissions(prompt: string, role: string, chat: any) {
        try {
            const permissionPrompt = `
                El usuario tiene estos roles: ${role}
                Solicitud: "${prompt}"
                
                ¿Tiene permisos para realizar esta operación?
                - Vendedores: pueden gestionar SUS productos (eliminar = borrado lógico)
                - Compradores: pueden consultar SUS compras y productos relacionados
                - Administradores: pueden despublicar/publicar productos
                - Transportadores: pueden consultar SUS asignaciones
                
                Responde solo "SI" o "NO"
            `;

            const result = await chat.sendMessage(permissionPrompt);
            return result.response.text().trim() === "SI";
        } catch (error) {
            console.error("Error en checkPermissions:", error);
            return false;
        }
    }

    // Construir respuesta cuando se deniegan permisos
    static buildPermissionDeniedResponse(role: string, prompt: string): string {
        const lowerPrompt = prompt.toLowerCase();
        
        // Analizar el tipo de operación solicitada y sugerir la acción apropiada
        if (lowerPrompt.includes('producto') && (lowerPrompt.includes('crear') || lowerPrompt.includes('nuevo'))) {
            return `Solo los vendedores pueden crear productos. ${this.getSuggestedAction(role, 'vendedor')}`;
        }
        
        if (lowerPrompt.includes('producto') && lowerPrompt.includes('editar')) {
            return `Solo los vendedores pueden editar sus productos. ${this.getSuggestedAction(role, 'vendedor')}`;
        }
        
        if (lowerPrompt.includes('admin') || lowerPrompt.includes('despublicar') || lowerPrompt.includes('publicar')) {
            return `Solo los administradores pueden realizar esta acción. ${this.getSuggestedAction(role, 'administrador')}`;
        }
        
        if (!role || role === 'guest' || role === 'anonimo') {
            return `Necesitas iniciar sesión para acceder a esta funcionalidad. Dirígete a ${AVAILABLE_ROUTES.login} para iniciar sesión o ${AVAILABLE_ROUTES.register} para registrarte.`;
        }
        
        return "No tienes permisos para realizar esta operación.";
    }

    // Obtener sugerencia de acción según el rol requerido
    static getSuggestedAction(currentRole: string, requiredRole: string): string {
        if (!currentRole || currentRole === 'guest') {
            return `Dirígete a ${AVAILABLE_ROUTES.register} para registrarte como ${requiredRole} o ${AVAILABLE_ROUTES.login} para iniciar sesión.`;
        } else {
            return `Si eres ${requiredRole}, inicia sesión en ${AVAILABLE_ROUTES.login}.`;
        }
    }

    // Verificar si el usuario tiene un rol específico
    static hasRole(userRole: string, requiredRole: string): boolean {
        if (!userRole) return false;
        return userRole.toLowerCase().includes(requiredRole.toLowerCase());
    }

    // Extraer ID del producto del prompt
    static async extractProductId(prompt: string, userId: string, chat: any) {
        try {
            // Intentar extraer ID del prompt directamente
            const idMatch = prompt.match(/\b(\d+)\b/);
            if (idMatch) {
                return idMatch[1];
            }

            // Si no hay ID explícito, buscar por nombre o descripción
            const searchPrompt = `
                Genera una consulta SQL para encontrar el ID del producto que el usuario quiere editar.
                Solicitud: "${prompt}"
                ID del vendedor: ${userId}
                
                Esquema: producto (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                
                La consulta debe buscar productos activos (eliminado = 0) del vendedor que coincidan con la descripción.
                Genera solo la consulta SQL sin formato markdown.
            `;

            const result = await chat.sendMessage(searchPrompt);
            const sqlQuery = result.response.text();
            const cleanedSQL = await this.cleanSQLResponse(sqlQuery);
            const sqlResponse: any = await IARepository.querySQL(cleanedSQL);

            if (sqlResponse && sqlResponse.length > 0) {
                return sqlResponse[0].id_producto.toString();
            }

            return null;
        } catch (error) {
            console.error("Error al extraer ID del producto:", error);
            return null;
        }
    }

    // Generar y ejecutar consultas SQL
    static async generateSQL(prompt: string, id: string, chat: any) {
        try {
            // Determinar el tipo de operación SQL
            const operationType = await this.determineSQLOperationType(prompt, chat);
            
            let sqlPrompt: string;
            
            if (operationType === 'ELIMINACION') {
                sqlPrompt = `
                    Genera una consulta SQL UPDATE para marcar un producto como eliminado (eliminado = 1).
                    Solicitud: "${prompt}"
                    ID del vendedor: ${id}
                    
                    Esquema: producto (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                    
                    La consulta debe actualizar solo productos del vendedor especificado.
                    Genera solo la consulta SQL sin formato markdown.
                `;
            } else if (operationType === 'PUBLICACION') {
                sqlPrompt = `
                    Genera una consulta SQL UPDATE para cambiar el estado de publicación de un producto (campo despublicado).
                    Solicitud: "${prompt}"
                    ID del administrador: ${id}
                    
                    Esquema: producto (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                    
                    Genera solo la consulta SQL sin formato markdown.
                `;
            } else {
                // Consulta general
                sqlPrompt = `
                    Genera una consulta SQL para: "${prompt}"
                    ID del usuario: ${id}
                    
                    Esquemas disponibles:
                    - usuario (id_usuario, nombre, nombre_usuario, correo, telefono)
                    - vendedor (id_vendedor, estado)
                    - comprador (id_comprador, estado)
                    - transportador (id_transportador, licencia_conduccion, soat, estado)
                    - administrador (id_administrador, estado)
                    - producto (id_producto, nombre, descripcion, latitud, longitud, cantidad, cantidad_minima_compra, imagen, precio_unidad, descuento, despublicado, fecha_publicacion, eliminado, id_vendedor)
                    - compra (id_compra, estado, precio_transporte, precio_producto, cantidad, fecha_compra, fecha_entrega, id_producto, id_vendedor, id_comprador, id_transportador)
                    
                    Genera solo la consulta SQL sin formato markdown.
                `;
            }

            // Generar la consulta
            const result = await chat.sendMessage(sqlPrompt);
            const sqlQuery = result.response.text();
            console.log("Consulta SQL generada:", sqlQuery);

            // Ejecutar la consulta
            const cleanedSQL = await this.cleanSQLResponse(sqlQuery);
            const sqlResponse: any = await IARepository.querySQL(cleanedSQL);

            // Formatear resultados
            const formattedResults = this.formatSQLResponse(sqlResponse);

            // Generar respuesta final
            const finalPrompt = `
                Respuesta de la base de datos: ${formattedResults}
                Solicitud original: "${prompt}"
                
                Proporciona una respuesta clara y útil basada en los resultados obtenidos.
                ${operationType === 'ELIMINACION' ? 'Si la operación fue exitosa, menciona que el producto ha sido eliminado lógicamente.' : ''}
                ${operationType === 'PUBLICACION' ? 'Si la operación fue exitosa, menciona el cambio en el estado de publicación.' : ''}
            `;

            const finalResult = await chat.sendMessage(finalPrompt);
            return finalResult.response.text();

        } catch (error) {
            console.error("Error al generar SQL:", error);
            return "Error al procesar la consulta en la base de datos.";
        }
    }

    // Determinar el tipo de operación SQL
    static async determineSQLOperationType(prompt: string, chat: any) {
        try {
            const typePrompt = `
                Analiza esta solicitud: "${prompt}"
                
                ¿Qué tipo de operación SQL se necesita?
                - "ELIMINACION" - Si se trata de eliminar un producto
                - "PUBLICACION" - Si se trata de publicar/despublicar un producto
                - "CONSULTA" - Para consultas de información
                
                Responde solo una de estas opciones.
            `;

            const result = await chat.sendMessage(typePrompt);
            return result.response.text().trim();
        } catch (error) {
            console.error("Error al determinar tipo de operación:", error);
            return "CONSULTA";
        }
    }

    // Limpiar respuesta SQL de formato markdown
    static async cleanSQLResponse(response: string): Promise<string> {
        // Remover bloques de código markdown
        const sqlRegex = /```sql\n([\s\S]*?)\n```/;
        const match = response.match(sqlRegex);
        if (match && match[1]) {
            return match[1].trim();
        }
        
        // Remover otras marcas de formato
        return response
            .replace(/``/g, '')
            .replace(/sql/g, '')
            .trim();
    }

    // Formatear respuesta de la base de datos
    static formatSQLResponse(results: any[]): string {
        if (!results || results.length === 0) {
            return "No se encontraron resultados.";
        }

        // Formatear cada fila de manera legible
        const formattedResults = results.map((row, index) => {
            const rowData = Object.entries(row)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
            return `Registro ${index + 1}: { ${rowData} }`;
        }).join('\n');

        return formattedResults;
    }
}

export default IAService;