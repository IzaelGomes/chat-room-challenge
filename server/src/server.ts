import express from 'express';
import cors from 'cors';
import { router } from './routes';

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
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
