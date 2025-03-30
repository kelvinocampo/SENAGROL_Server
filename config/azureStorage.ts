import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

const { AZURE_STORAGE_CONNECTION_STRING = "" } = process.env;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Falta la cadena de conexión de Azure Storage");
}

export const connectStorage = (AZURE_CONTAINER_NAME: string) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    return containerClient;
}
