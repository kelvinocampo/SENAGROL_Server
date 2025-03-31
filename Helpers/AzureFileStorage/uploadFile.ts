import { v4 as uuidv4 } from "uuid";
import { connectStorage } from "../../config/azureStorage";

/**
 * Sube un archivo a Azure Blob Storage con manejo robusto de errores
 * @param file - Archivo de Multer
 * @param containerName - Nombre del contenedor ("usuario" | "producto")
 * @returns Promise<{url: string, blobName: string}> - URL pública y nombre del blob
 */
export const uploadToAzure = async (
    file: Express.Multer.File | undefined,
    containerName: string
): Promise<{ url: string, blobName: string }> => {
    // Validaciones iniciales
    if (!file || !file.buffer || file.buffer.length === 0) {
        throw new Error("Archivo inválido o vacío");
    }

    try {
        // 1. Generar nombre seguro para el blob
        const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
        const cleanBaseName = file.originalname
            .replace(/\.[^/.]+$/, '') // Eliminar extensión existente
            .replace(/[^a-z0-9-]/gi, '') // Eliminar caracteres especiales (excepto guiones)
            .replace(/-+/g, '-') // Reemplazar múltiples guiones por uno solo
            .replace(/^-|-$/g, '') // Eliminar guiones al inicio/final
            .toLowerCase();

        const blobName = `${uuidv4()}-${cleanBaseName}.${fileExtension}`;

        const blockBlobClient = (connectStorage(containerName)).getBlockBlobClient(blobName);

        // 4. Subir el archivo con metadatos
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: {
                blobContentType: file.mimetype || 'application/octet-stream',
                blobContentDisposition: `inline; filename="${cleanBaseName}.${fileExtension}"`,
                blobCacheControl: 'public, max-age=31536000' // Cache de 1 año
            }
        });

        // 5. Verificar que el archivo se subió correctamente
        const exists = await blockBlobClient.exists();
        if (!exists) {
            throw new Error("El archivo no se subió correctamente");
        }

        return {
            url: blockBlobClient.url,
            blobName: blobName
        };

    } catch (error) {
        console.error(`Error al subir ${file.originalname} a Azure:`, error);
        throw new Error(`Error al subir archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};