import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name || '',
  api_key: config.cloudinary_api_key || '',
  api_secret: config.cloudinary_api_secret || '',
});


export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      {
        public_id: imageName.trim(),
        folder: 'rental-properties',
      },
      function (error, result) {
        if (error) {
          reject(error);
          return;
        }

        // Delete local file after successful upload
        fs.unlink(path, err => {
          if (err) console.log('File delete error:', err);
        });

        resolve({
          secure_url: result?.secure_url || '',
          public_id: result?.public_id || '',
        });
      },
    );
  });
};

export const sendImageBufferToCloudinary = (
  imageName: string,
  buffer: Buffer,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: imageName.trim(),
        folder: config.CLOUDINARY_FOLDER || 'NextPortfolio',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({
          secure_url: result?.secure_url || '',
          public_id: result?.public_id || '',
        });
      },
    );
    upload.end(buffer);
  });
};

export default cloudinary;
