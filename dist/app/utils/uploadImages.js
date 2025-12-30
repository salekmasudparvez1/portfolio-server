"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = void 0;
const cloudinary_1 = require("../config/cloudinary");
const uploadMultipleImages = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided',
            });
        }
        const uploadedImages = [];
        for (const file of files) {
            const result = await (0, cloudinary_1.sendImageBufferToCloudinary)(file.originalname, file.buffer);
            uploadedImages.push(result);
        }
        return res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            count: uploadedImages.length,
            images: uploadedImages,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error,
        });
    }
};
exports.uploadMultipleImages = uploadMultipleImages;
exports.default = exports.uploadMultipleImages;
//# sourceMappingURL=uploadImages.js.map