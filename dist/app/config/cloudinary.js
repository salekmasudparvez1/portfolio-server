"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendImageBufferToCloudinary = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name || '',
    api_key: config_1.default.cloudinary_api_key || '',
    api_secret: config_1.default.cloudinary_api_secret || '',
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, {
            public_id: imageName.trim(),
            folder: 'rental-properties',
        }, function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            // Delete local file after successful upload
            fs_1.default.unlink(path, err => {
                if (err)
                    console.log('File delete error:', err);
            });
            resolve({
                secure_url: result?.secure_url || '',
                public_id: result?.public_id || '',
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const sendImageBufferToCloudinary = (imageName, buffer) => {
    return new Promise((resolve, reject) => {
        const upload = cloudinary_1.v2.uploader.upload_stream({
            public_id: imageName.trim(),
            folder: config_1.default.CLOUDINARY_FOLDER || 'NextPortfolio',
        }, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({
                secure_url: result?.secure_url || '',
                public_id: result?.public_id || '',
            });
        });
        upload.end(buffer);
    });
};
exports.sendImageBufferToCloudinary = sendImageBufferToCloudinary;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map