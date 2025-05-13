import { AZURE_CONTAINER_NAME, connectStorage } from "../Config/azureStorage";

/**
 * Elimina un archivo de Azure Blob Storage a partir de su URL
 * @param fileUrl - URL completa del archivo a eliminar
 * @param containerName - Nombre del contenedor donde está almacenado el archivo
 */
export const deleteFromAzure = async (fileUrl: string, containerName: AZURE_CONTAINER_NAME) => {
    try {
        // Extraer el nombre del blob desde la URL
        const encodedBlobName = fileUrl.split('/').pop();
        if (!encodedBlobName) throw new Error("No se pudo extraer el nombre del archivo desde la URL");

        const blobName = decodeURIComponent(encodedBlobName);
        const blockBlobClient = connectStorage(containerName).getBlockBlobClient(blobName);

        // Eliminar el blob
        await blockBlobClient.deleteIfExists(); // deleteIfExists es más seguro

    } catch (error) {
        console.error("Error al eliminar archivo de Azure:", error);
        throw new Error(`Error al eliminar archivo de Azure: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};
