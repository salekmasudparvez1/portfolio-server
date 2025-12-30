import { Request, Response } from 'express';
import { sendImageBufferToCloudinary } from '../config/cloudinary';

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    const uploadedImages: any[] = [];

    for (const file of files) {
      const result = await sendImageBufferToCloudinary(
        file.originalname,
        file.buffer,
      );
      uploadedImages.push(result);
    }

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      count: uploadedImages.length,
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error,
    });
  }
};
export default uploadMultipleImages;