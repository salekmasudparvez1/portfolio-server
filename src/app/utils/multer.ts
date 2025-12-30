import multer from 'multer';

// Use memory storage to be compatible with serverless (read-only FS)
const storage = multer.memoryStorage();

export const uploadMultiple = multer({ storage }).array('images', 10);
