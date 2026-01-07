import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  database_name:process.env.DB_NAME,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY,
  RETURN_URL:process.env.RETURN_URL,
  STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET,
  CLOUDINARY_FOLDER:process.env.CLOUDINARY_FOLDER,
  RESEND_API_KEY:process.env.RESEND_API_KEY,
  ADMIN_REGISTRATION_KEY: process.env.ADMIN_REGISTRATION_KEY,
  EMAIL_TEMPLATE_ID: process.env.EMAIL_TEMPLATE_ID,
  HOST_URL: process.env.HOST_URL,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};
