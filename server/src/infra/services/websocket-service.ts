import { Server, Socket } from 'socket.io';

import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';
import { RoomRepositoryInterface } from '../../app/repository/room-repository-interface';
import { GetRoomByIdUseCase } from '../../app/usecases/get-room-by-id-usecase';
import { AppError } from '../../app/error/app-error';
import { UpdateMessageUseCase } from '../../app/usecases/update-message-usecase';
import { DeleteMessageUseCase } from '../../app/usecases/delete-message-usecase';

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
  private updateMessageUseCase: UpdateMessageUseCase;

  constructor(
    private io: Server,
    messageRepository: MessageRepository,
    roomRepository: RoomRepositoryInterface
  ) {
    this.messageRepository = messageRepository;
    this.userRepository = new UserRepository();
    this.roomRepository = roomRepository;
    this.getRoomByIdUseCase = new GetRoomByIdUseCase(roomRepository);
    this.updateMessageUseCase = new UpdateMessageUseCase(messageRepository);
  }

  setupSocketEvents(): void {
    this.io.on('connection', async (socket: AuthenticatedSocket) => {
      socket.on('join-room', async (roomId: string, user: UserConnected) => {
        try {
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

      socket.on(
        'update-message',
        async (data: {
          messageId: string;
          content: string;
          roomId: string;
          user: { id: string; username: string };
        }) => {
          try {
            if (!data.user) {
              socket.emit('error', { message: 'Usuário não autenticado' });
              return;
            }

            const updatedMessage = await this.updateMessageUseCase.execute({
              messageId: data.messageId,
              content: data.content,
              userId: data.user.id,
            });

            this.io.to(data.roomId).emit('message-updated', {
              id: updatedMessage.message.id,
              content: updatedMessage.message.content,
              roomId: updatedMessage.message.roomId,
              userId: updatedMessage.message.userId,
              user: {
                id: updatedMessage.message.user?.id,
                username: updatedMessage.message.user?.username,
              },
              createdAt: updatedMessage.message.createdAt,
              updatedAt: updatedMessage.message.updatedAt,
            });
          } catch (error) {
            if (error instanceof AppError) {
              socket.emit('error', { message: error.message });
            } else {
              socket.emit('error', { message: 'Erro interno do servidor' });
            }
          }
        }
      );

      socket.on('leave-room', (roomId: string, user: UserConnected) => {
        socket.to(roomId).emit('user-left', {
          userId: user.id,
          username: user.username,
          roomId,
        });
        socket.leave(roomId);
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

      socket.on(
        'delete-message',
        async (data: {
          messageId: string;
          user: { id: string; username: string };
        }) => {
          try {
            if (!data.user) {
              socket.emit('error', { message: 'Usuário não autenticado' });
              return;
            }

            const message = await this.messageRepository.findMessageById(
              data.messageId
            );

            if (!message) {
              socket.emit('error', { message: 'Mensagem não encontrada' });
              return;
            }

            const deleteMessageUseCase = new DeleteMessageUseCase(
              this.messageRepository
            );

            await deleteMessageUseCase.execute({
              messageId: data.messageId,
              userId: data.user.id,
            });

            this.io.to(message.roomId).emit('message-deleted', data.messageId);
          } catch (error) {
            if (error instanceof AppError) {
              socket.emit('error', { message: error.message });
            } else {
              socket.emit('error', { message: 'Erro interno do servidor' });
            }
          }
        }
      );

      socket.on('disconnect', () => {
        const rooms = Array.from(socket.rooms);

        rooms.forEach(roomId => {
          if (roomId !== socket.id) {
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
