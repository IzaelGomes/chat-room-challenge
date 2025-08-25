import { Server, Socket } from 'socket.io';

import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';
import { RoomRepositoryInterface } from '../../app/repository/room-repository-interface';
import { GetRoomByIdUseCase } from '../../app/usecases/get-room-by-id-usecase';
import { AppError } from '../../app/error/app-error';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}

type UserConnected = {
  id: string;
  username: string;
};

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

  setupSocketEvents(): void {
    this.io.on('connection', async (socket: AuthenticatedSocket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      socket.on('join-room', async (roomId: string, user: UserConnected) => {
        try {
          console.log('entrou na sala', user);
          const result = await this.getRoomByIdUseCase.execute({
            id: roomId,
          });
          const room = result.room;

          socket.join(roomId);

          socket.emit('room-messages', room.messages);

          socket.to(roomId).emit('user-joined', {
            userId: user.id,
            username: user.username,
            roomId,
          });
        } catch (error) {
          if (error instanceof AppError) {
            socket.emit('error', { message: error.message });
          } else {
            socket.emit('error', { message: 'Erro interno do servidor' });
          }
        }
      });

      socket.on('leave-room', (roomId: string, user: UserConnected) => {
        socket.to(roomId).emit('user-left', {
          userId: user.id,
          username: user.username,
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
            if (error instanceof AppError) {
              socket.emit('error', { message: error.message });
            } else {
              socket.emit('error', { message: 'Erro ao enviar mensagem' });
            }
          }
        }
      );

      socket.on('disconnect', () => {
        const rooms = Array.from(socket.rooms);

        rooms.forEach(roomId => {
          if (roomId !== socket.id) {
            console.log(`Notificando saída na sala ${roomId}`);
            socket.to(roomId).emit('user-left', {
              userId: socket.user?.id || socket.id,
              username: socket.user?.username || 'Usuário desconectado',
              roomId,
            });
          }
        });
      });
    });
  }
}
