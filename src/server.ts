import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Request, Response } from 'express';




async function connectDatabase() {
  try {
    await mongoose.connect(config.database_url as string);
    // Only start a listener when running locally (not serverless)
    if (!process.env.VERCEL) {
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port} `)
      })
    }
  } catch (err) {
    console.error(`❌ Database Connection Error:`, err);
  }
}

// Call connectDatabase only in non-serverless dev
if (!process.env.VERCEL) {
  connectDatabase();
}

export default async function handler(req: Request, res: Response) {
  // Ensure DB connected before handling request in serverless
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(config.database_url as string);
    } catch (err) {
      console.error('DB connect failed in handler', err);
      return res.status(500).send('Database connection error');
    }
  }
  return app(req, res);
}