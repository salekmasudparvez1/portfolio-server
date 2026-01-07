import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import authRouter from './app/modules/auth/auth.routes';
import adminRouter from './app/modules/admin/admin.routes';
import { PostRouter } from './app/modules/post/post.routes';
import { ContactRouter } from './app/modules/contact/contact.routes';
import limiter from './app/middlewares/limiter';

const app: Application = express();

// 1. CORS MUST BE FIRST (Before parsers and limiters)
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://api.parvez.dev', 'https://parvez.dev'], 
  credentials: true 
}));

// 2. Parsers
app.use(express.json());
app.use(cookieParser()); // Essential for req.cookies
app.use(express.urlencoded({ extended: true }));

// 3. Limiter (After CORS, so browser knows request was allowed even if rate limited)
app.use(limiter);

// 4. Application Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/post', PostRouter);
app.use('/api/contact', ContactRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running !');
});

// 5. Errors
app.use(globalErrorHandler);
app.use(notFound);

export default app;