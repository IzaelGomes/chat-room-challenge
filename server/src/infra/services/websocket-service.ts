import { Server, Socket } from 'socket.io';
import { MessageRepository } from '../repositories/message-repository';
import { RoomRepositoryInterface } from '../../app/repository/room-repository-interface';
import { CreateRoomUseCase } from '../../app/usecases/create-room-usecase';
import { GetRoomsUseCase } from '../../app/usecases/get-rooms-usecase';
import { GetRoomByIdUseCase } from '../../app/usecases/get-room-by-id-usecase';

export class WebSocketService {
  private messageRepository: MessageRepository;
  private roomRepository: RoomRepositoryInterface;
  private createRoomUseCase: CreateRoomUseCase;
  private getRoomsUseCase: GetRoomsUseCase;
  private getRoomByIdUseCase: GetRoomByIdUseCase;

  constructor(
    private io: Server,
    messageRepository: MessageRepository,
    roomRepository: RoomRepositoryInterface
  ) {
    this.messageRepository = messageRepository;
    this.roomRepository = roomRepository;
    this.createRoomUseCase = new CreateRoomUseCase(roomRepository);
    this.getRoomsUseCase = new GetRoomsUseCase(roomRepository);
    this.getRoomByIdUseCase = new GetRoomByIdUseCase(roomRepository);
  }

  setupSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('join-room', async (roomId: string) => {
        try {
          const result = await this.getRoomByIdUseCase.execute({ id: roomId });
          const room = result.room;

          socket.join(roomId);
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
        socket.to(roomId).emit('user-left', {
          userId: socket.id,
          roomId,
        });
      });

      socket.on(
        'send-message',
        async (data: { roomId: string; content: string }) => {
          try {
            await this.getRoomByIdUseCase.execute({ id: data.roomId });

            const newMessage = await this.messageRepository.createMessage({
              content: data.content,
              roomId: data.roomId,
              createdAt: new Date(),
            });

            this.io.to(data.roomId).emit('new-message', {
              id: newMessage.id,
              content: newMessage.content,
              roomId: newMessage.roomId,
              createdAt: newMessage.createdAt,
              updatedAt: newMessage.updatedAt,
            });
          } catch (error) {
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
        console.log(`Usuário desconectado: ${socket.id}`);
      });
    });
  }
}
