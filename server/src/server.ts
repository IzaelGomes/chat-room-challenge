import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import './infra/config/env';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { router } from './routes';
import { AppError } from './app/error/app-error';
import { WebSocketService } from './infra/services/websocket-service';
import { RoomRepository } from './infra/repositories/room-repository';
import { MessageRepository } from './infra/repositories/message-repository';
import { env } from './infra/config/env';

const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: [env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
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

const io = new Server(server, {
  cors: {
    origin: [env.FRONTEND_URL],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
  },
});

const roomRepository = new RoomRepository();
const messageRepository = new MessageRepository();

const webSocketService = new WebSocketService(
  io,
  messageRepository,
  roomRepository
);
webSocketService.setupSocketEvents();

server.listen(env.PORT, () => {
  console.log('Server is running on port 3001');
});
