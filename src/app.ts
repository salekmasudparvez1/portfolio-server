
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import authRouter from './app/modules/auth/auth.routes';
import adminRouter from './app/modules/admin/admin.routes';
import { PostRouter } from './app/modules/post/post.routes';




const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5000', 'https://api.parvez.dev', 'https://parvez.dev'], credentials: true }));

// application routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/post', PostRouter);




app.get('/', (req: Request, res: Response) => {
  res.send('Server is running !');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;