"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPostImages = exports.uploadMixed = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const fs_extra_1 = __importDefault(require("fs-extra"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config")); // Assuming you have a config file, otherwise use process.env directly
// 1. CLOUDINARY CONFIGURATION (CRITICAL STEP)
const { cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret } = config_1.default;
if (!cloudinary_cloud_name || !cloudinary_api_key || !cloudinary_api_secret) {
    throw new Error('Cloudinary configuration missing. Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.');
}
cloudinary_1.v2.config({
    cloud_name: cloudinary_cloud_name,
    api_key: cloudinary_api_key,
    api_secret: cloudinary_api_secret,
});
// 2. MULTER STORAGE CONFIG
// We must save files to disk first so Cloudinary can read them from a path.
// Use /tmp for serverless environments (Vercel, AWS Lambda) where file system is read-only
const upload = (0, multer_1.default)({
    dest: '/tmp/uploads/', // Use /tmp for serverless compatibility
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size to 10MB
});
// 3. MULTER FIELDS CONFIG
exports.uploadMixed = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'ogImage', maxCount: 1 },
    { name: 'gallery', maxCount: 5 }
]);
// 3.5 DEBUG MIDDLEWARE - Add before processPostImages
// export const debugRequest = (req: any, res: any, next: any) => {
//   // console.log("\n🔍 [DEBUG] Request details:");
//   // console.log("📍 Route:", req.method, req.path);
//   // console.log("📦 Content-Type:", req.headers['content-type']);
//   // console.log("📁 Files keys:", req.files ? Object.keys(req.files) : 'no files');
//   // console.log("📋 Body keys:", Object.keys(req.body));
//   // console.log("📄 Body.seo:", req.body.seo);
//   if (req.files) {
//     console.log("🖼️ Files detail:", JSON.stringify(req.files, null, 2));
//   }
//   next();
// };
// 4. THE PROCESSOR MIDDLEWARE
const processPostImages = async (req, res, next) => {
    // console.log("\n🚀 [ImageUpload] processPostImages middleware started");
    // console.log("📍 [ImageUpload] Route:", req.method, req.path);
    const files = req.files;
    // console.log("📁 [ImageUpload] Files received:", {
    //   hasFiles: !!files,
    //   filesType: typeof files,
    //   filesKeys: files ? Object.keys(files) : 'none',
    //   fileFields: files ? Object.keys(files) : [],
    //   coverImage: files?.coverImage?.length || 0,
    //   ogImage: files?.ogImage?.length || 0,
    //   gallery: files?.gallery?.length || 0
    // });
    // console.log("📋 [ImageUpload] Request body SEO before processing:", {
    //   hasSeo: !!req.body.seo,
    //   seoType: typeof req.body.seo,
    //   seoValue: req.body.seo
    // });
    // if (!files || Object.keys(files).length === 0) {
    //  // console.log("⚠️ [ImageUpload] No files in request, skipping middleware");
    //   return next();
    // }
    try {
        const uploadPromises = [];
        // --- A. PROCESS COVER IMAGE ---
        if (files.coverImage?.[0]) {
            const file = files.coverImage[0];
            const promise = cloudinary_1.v2.uploader.upload(file.path, {
                folder: `${config_1.default?.CLOUDINARY_FOLDER}/covers`,
                format: 'webp',
                transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }]
            }).then((result) => {
                req.body.coverImage = result.secure_url;
                return fs_extra_1.default.unlink(file.path);
            });
            uploadPromises.push(promise);
        }
        // --- B. PROCESS OG IMAGE ---
        if (files.ogImage?.[0]) {
            // console.log("🖼️ [ImageUpload] ogImage file detected:", {
            //   filename: files.ogImage[0].originalname,
            //   size: files.ogImage[0].size,
            //   mimetype: files.ogImage[0].mimetype,
            //   path: files.ogImage[0].path
            // });
            const file = files.ogImage[0];
            const promise = (async () => {
                try {
                    // console.log("☁️ [ImageUpload] Uploading ogImage to Cloudinary...");
                    const result = await cloudinary_1.v2.uploader.upload(file.path, {
                        folder: `${config_1.default.CLOUDINARY_FOLDER}/seo`,
                        format: "webp",
                        transformation: [
                            { width: 1200, height: 630, crop: "fill", gravity: "center" },
                            { quality: "auto" },
                        ],
                    });
                    // console.log("✅ [ImageUpload] Cloudinary upload successful:", {
                    //   secure_url: result.secure_url,
                    //   public_id: result.public_id
                    // });
                    // console.log("📦 [ImageUpload] SEO object before processing:", {
                    //   seo: req.body.seo,
                    //   type: typeof req.body.seo
                    // });
                    // Ensure SEO object exists
                    if (!req.body.seo)
                        req.body.seo = {};
                    // Parse SEO if sent as JSON string
                    if (typeof req.body.seo === "string") {
                        try {
                            req.body.seo = JSON.parse(req.body.seo);
                            // console.log("📦 [ImageUpload] SEO parsed from JSON string:", req.body.seo);
                        }
                        catch {
                            // console.log("⚠️ [ImageUpload] Failed to parse SEO JSON, using empty object");
                            req.body.seo = {};
                        }
                    }
                    req.body.seo.ogImage = result.secure_url;
                    // console.log("✅ [ImageUpload] ogImage set in req.body.seo:", req.body.seo.ogImage);
                }
                catch (error) {
                    console.error("❌ [ImageUpload] Error uploading ogImage:", error);
                    throw error;
                }
                finally {
                    // Always cleanup temp file
                    await fs_extra_1.default.unlink(file.path).catch(() => { });
                }
            })();
            uploadPromises.push(promise);
        }
        else {
            // console.log("⚠️ [ImageUpload] No ogImage file found in request");
        }
        // --- C. PROCESS GALLERY ---
        if (files.gallery && files.gallery.length > 0) {
            const galleryUrls = [];
            const galleryPromises = files.gallery.map(file => cloudinary_1.v2.uploader.upload(file.path, {
                folder: `${config_1.default?.CLOUDINARY_FOLDER}/gallery`,
                format: 'webp',
                transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }]
            }).then((result) => {
                galleryUrls.push(result.secure_url);
                return fs_extra_1.default.unlink(file.path);
            }));
            uploadPromises.push(Promise.all(galleryPromises).then(() => {
                req.body.gallery = galleryUrls;
            }));
        }
        await Promise.all(uploadPromises);
        next();
    }
    catch (error) {
        // Cleanup local files on error
        if (files) {
            Object.values(files).flat().forEach(async (file) => {
                if (await fs_extra_1.default.pathExists(file.path))
                    await fs_extra_1.default.unlink(file.path).catch(() => { });
            });
        }
        next(new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Image processing failed'));
    }
};
exports.processPostImages = processPostImages;
//# sourceMappingURL=ImageUpload.js.map