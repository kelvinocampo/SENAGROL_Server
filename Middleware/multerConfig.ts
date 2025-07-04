import multer from "multer";

const storage = multer.memoryStorage(); 

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export const uploadFiles = upload.fields([
    { name: "imagen", maxCount: 5 },

]);

export default upload;
