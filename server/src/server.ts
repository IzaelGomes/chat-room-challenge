import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import './infra/config/env';
import { router } from './routes';
import { AppError } from './app/error/app-error';
import { env } from './infra/config/env';

const app = express();
app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(router);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.getErrorInfo.statusCode)
      .json({ message: err.message, statusCode: err.getErrorInfo.statusCode });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
