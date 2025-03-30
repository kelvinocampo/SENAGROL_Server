import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";
dotenv.config();

const { AZURE_STORAGE_CONNECTION_STRING = "", AZURE_CONTAINER_NAME = "" } = process.env;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Falta la cadena de conexión de Azure Storage");
}

if (!AZURE_CONTAINER_NAME) {
    throw new Error("Falta el nombre del contenedor de Azure Storage");
}

export const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
export const containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
