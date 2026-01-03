import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs-extra';
import { StatusCodes } from 'http-status-codes';
import AppError from '../errors/AppError';
import config from '../config'; // Assuming you have a config file, otherwise use process.env directly

// 1. CLOUDINARY CONFIGURATION (CRITICAL STEP)
const { cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret } = config;
if (!cloudinary_cloud_name || !cloudinary_api_key || !cloudinary_api_secret) {
  throw new Error('Cloudinary configuration missing. Make sure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are set.');
}
cloudinary.config({
  cloud_name: cloudinary_cloud_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

// 2. MULTER STORAGE CONFIG
// We must save files to disk first so Cloudinary can read them from a path.
const upload = multer({ 
    dest: 'uploads/tmp/', // Ensure this folder exists or is created
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: Limit file size to 10MB
});

// 3. MULTER FIELDS CONFIG
export const uploadMixed = upload.fields([
  { name: 'coverImage', maxCount: 1 }, 
  { name: 'ogImage', maxCount: 1 },    
  { name: 'gallery', maxCount: 5 }     
]);

// 4. THE PROCESSOR MIDDLEWARE
export const processPostImages = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files) return next();

  try {
    const uploadPromises: Promise<any>[] = [];

    // --- A. PROCESS COVER IMAGE ---
    if (files.coverImage?.[0]) {
      const file = files.coverImage[0];
      const promise = cloudinary.uploader.upload(file.path, {
        folder: `${config?.CLOUDINARY_FOLDER}/covers`,
        format: 'webp',
        transformation: [{ width: 1200, crop: "limit" }, { quality: "auto" }]
      }).then((result) => {
        
        req.body.coverImage = result.secure_url;
        return fs.unlink(file.path);
      });
      uploadPromises.push(promise);
    }

    // --- B. PROCESS OG IMAGE ---
    if (files.ogImage?.[0]) {
      const file = files.ogImage[0];
      const promise = cloudinary.uploader.upload(file.path, {
        folder: `${config?.CLOUDINARY_FOLDER}/seo`,
        format: 'jpg', 
        transformation: [
          { width: 1200, height: 630, crop: "fill", gravity: "center" }, 
          { quality: "auto" }
        ]
      }).then((result) => {
        // Handle nested SEO object
        if (!req.body.seo) req.body.seo = {};
        if (typeof req.body.seo === 'string') {
            try {
                req.body.seo = JSON.parse(req.body.seo);
            } catch (e) {
                req.body.seo = {};
            }
        }
        req.body.seo.ogImage = result.secure_url;
        return fs.unlink(file.path);
      });
      uploadPromises.push(promise);
    }

    // --- C. PROCESS GALLERY ---
    if (files.gallery && files.gallery.length > 0) {
      const galleryUrls: string[] = [];
      const galleryPromises = files.gallery.map(file => 
        cloudinary.uploader.upload(file.path, {
          folder: `${config?.CLOUDINARY_FOLDER}/gallery`,
          format: 'webp',
          transformation: [{ width: 1000, crop: "limit" }, { quality: "auto" }]
        }).then((result) => {
          galleryUrls.push(result.secure_url);
          return fs.unlink(file.path);
        })
      );

      uploadPromises.push(
        Promise.all(galleryPromises).then(() => {
           req.body.gallery = galleryUrls;
        })
      );
    }

    await Promise.all(uploadPromises);
    next();

  } catch (error) {
    // Cleanup local files on error
    if (files) {
        Object.values(files).flat().forEach(async (file) => {
            if (await fs.pathExists(file.path)) await fs.unlink(file.path).catch(() => {});
        });
    }
    next(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Image processing failed'));
  }
};