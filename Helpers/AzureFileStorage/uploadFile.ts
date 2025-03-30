import { v4 as uuidv4 } from "uuid";
import { connectStorage } from "../../config/azureStorage";

/**
 * Sube un archivo a Azure Blob Storage con nombre seguro
 * @param file - Archivo de Multer
 * @param type - Tipo de contenedor ("usuario" | "producto")
 * @returns URL pública del archivo subido
 */
export const uploadToAzure = async (file: Express.Multer.File, type: "usuario" | "producto"): Promise<string> => {
    try {
        if (!file || !file.buffer) return "";

        // 1. Generar nombre seguro para el archivo
        const fileExtension = file.originalname.split('.').pop() || 'bin';
        const safeFileName = file.originalname
            .replace(/\.[^/.]+$/, '') // Eliminar extensión existente
            .replace(/[^a-z0-9]/gi, '-') // Reemplazar caracteres especiales
            .toLowerCase();
            
        // 2. Crear nombre único con UUID y nombre seguro
        const blobName = `${uuidv4()}-${safeFileName}.${fileExtension}`.substring(0, 1024);

        // 3. Obtener cliente de blob
        const blockBlobClient = connectStorage(type).getBlockBlobClient(blobName);

        // 4. Subir el archivo
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { 
                blobContentType: file.mimetype,
                blobContentDisposition: `inline; filename="${safeFileName}.${fileExtension}"`
            }
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error("Error al subir a Azure:", error);
        return "";
    }
};