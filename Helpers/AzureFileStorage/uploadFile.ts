import { v4 as uuidv4 } from "uuid";
import { containerClient } from "../../config/azureStorage";

export const uploadToAzure = async (file: Express.Multer.File): Promise<string | null> => {
    try {
        if (!file) return null;

        const blobName = `${uuidv4()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        return blockBlobClient.url;
    } catch (error) {
        console.error("Error subiendo archivo a Azure:", error);
        return null;
    }
};
