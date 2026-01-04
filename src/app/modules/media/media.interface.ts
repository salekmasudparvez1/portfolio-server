export interface IMedia {
  _id: string;
  // The unique identifier from Cloudinary (e.g., "my-folder/sub-folder/my-image")
  public_id: string;
  
  // The actual folder name/path (e.g., "my-folder/sub-folder")
  folder: string; // Files not in a folder go to 'root'

  // File Details
  filename: string; // The display name
  format?: string; // jpg, png, webp
  version?: number; // Cloudinary version number
  
  // URLs
  url: string;
  secure_url: string;
  
  // Metadata for UI (Size, Dimensions)
  width?: number;
  height?: number;
  bytes?: number; // File size
  
  // Optional: Tags for searching
  tags?: string[];

  createdAt: Date;
  updatedAt: Date;
}
