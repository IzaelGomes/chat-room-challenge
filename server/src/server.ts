import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { router } from './routes';
import { AppError } from './app/error/app-error';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    console.log(err);
    return res
      .status(err.getErrorInfo.statusCode)
      .json({ message: err.message, statusCode: err.getErrorInfo.statusCode });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
