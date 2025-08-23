import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';
import { RoomRepositoryInterface } from '../../app/repository/room-repository-interface';
import { GetRoomByIdUseCase } from '../../app/usecases/get-room-by-id-usecase';
import { env } from '../config/env';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}

export class WebSocketService {
  private messageRepository: MessageRepository;
  private userRepository: UserRepository;
  private roomRepository: RoomRepositoryInterface;
  private getRoomByIdUseCase: GetRoomByIdUseCase;

  constructor(
    private io: Server,
    messageRepository: MessageRepository,
    roomRepository: RoomRepositoryInterface
  ) {
    this.messageRepository = messageRepository;
    this.userRepository = new UserRepository();
    this.roomRepository = roomRepository;
    this.getRoomByIdUseCase = new GetRoomByIdUseCase(roomRepository);
  }

  private async authenticateSocket(
    socket: AuthenticatedSocket
  ): Promise<boolean> {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const parsedCookies = cookie.parse(cookies);
        const token = parsedCookies['auth-token'];

        if (token) {
          const decoded = jwt.verify(token, env.JWT_SECRET) as {
            userId: string;
            username: string;
          };
          const user = await this.userRepository.findUserById(decoded.userId);

          if (user) {
            socket.user = {
              id: user.id,
              username: user.username,
            };
            console.log(
              `Usuário autenticado via cookie: ${user.username} (${socket.id})`
            );
            return true;
          }
        }
      }
      console.log(`Cliente não autenticado: ${socket.id}`);
      return false;
    } catch (error) {
      console.error('Erro na autenticação via cookie:', error);
      return false;
    }
  }

  setupSocketEvents(): void {
    this.io.on('connection', async (socket: AuthenticatedSocket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      await this.authenticateSocket(socket);

      socket.on('join-room', async (roomId: string) => {
        try {
          const result = await this.getRoomByIdUseCase.execute({ id: roomId });
          const room = result.room;

          socket.join(roomId);
          console.log(`Cliente ${socket.id} entrou na sala ${roomId}`);

          socket.emit('room-messages', room.messages);

          socket.to(roomId).emit('user-joined', {
            userId: socket.id,
            roomId,
          });
        } catch (error) {
          console.error('Erro ao entrar na sala:', error);
          if (
            error instanceof Error &&
            error.message.includes('não encontrada')
          ) {
            socket.emit('error', { message: 'Sala não encontrada' });
          } else {
            socket.emit('error', { message: 'Erro interno do servidor' });
          }
        }
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`Cliente ${socket.id} saiu da sala ${roomId}`);
        socket.to(roomId).emit('user-left', {
          userId: socket.id,
          roomId,
        });
      });

      socket.on(
        'send-message',
        async (data: {
          roomId: string;
          content: string;
          user: { id: string; username: string };
        }) => {
          console.log('data', data);

          try {
            if (!data.user) {
              socket.emit('error', { message: 'Usuário não autenticado' });
              return;
            }

            await this.getRoomByIdUseCase.execute({ id: data.roomId });

            const newMessage = await this.messageRepository.createMessage({
              content: data.content,
              roomId: data.roomId,
              userId: data.user.id,
              createdAt: new Date(),
            });

            console.log(
              `Nova mensagem na sala ${data.roomId} de ${data.user.username}:`,
              newMessage.content
            );

            this.io.to(data.roomId).emit('new-message', {
              id: newMessage.id,
              content: newMessage.content,
              roomId: newMessage.roomId,
              userId: newMessage.userId,
              user: {
                id: data.user.id,
                username: data.user.username,
              },
              createdAt: newMessage.createdAt,
              updatedAt: newMessage.updatedAt,
            });
          } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            if (
              error instanceof Error &&
              error.message.includes('não encontrada')
            ) {
              socket.emit('error', { message: 'Sala não encontrada' });
            } else {
              socket.emit('error', { message: 'Erro ao enviar mensagem' });
            }
          }
        }
      );

      socket.on('disconnect', () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });
  }

  async sendMessageToRoom(roomId: string, content: string): Promise<void> {
    try {
      const newMessage = await this.messageRepository.createMessage({
        content,
        roomId,
        userId: '1',
        createdAt: new Date(),
      });

      this.io.to(roomId).emit('new-message', newMessage);
    } catch (error) {
      console.error('Erro ao enviar mensagem programática:', error);
    }
  }
}
