import { v4 as uuidv4 } from "uuid";
import { connectStorage } from "../../config/azureStorage";

export const uploadToAzure = async (file: Express.Multer.File, type: "usuario" | "producto"): Promise<string> => {
    try {
        if (!file) return "";

        const blobName = `${uuidv4()}-${file.originalname}`;
        const blockBlobClient = (connectStorage(type)).getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error("Error subiendo archivo a Azure:", error);
        return "";
    }
};
