import { prisma } from '../config/prisma';
import {
  Message,
  MessageRepositoryInterface,
} from '../../app/repository/message-repository-interface';

export class MessageRepository implements MessageRepositoryInterface {
  async createMessage(
    message: Omit<Message, 'id' | 'updatedAt'>
  ): Promise<Message> {
    const createdMessage = await prisma.message.create({
      data: {
        content: message.content,
        roomId: message.roomId,
        userId: message.userId,
        createdAt: message.createdAt,
      },
    });

    return {
      id: createdMessage.id,
      content: createdMessage.content,
      createdAt: createdMessage.createdAt,
      updatedAt: createdMessage.updatedAt,
      roomId: createdMessage.roomId,
      userId: createdMessage.userId,
    };
  }

  async getMessagesByRoomId(roomId: string): Promise<Message[]> {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return messages.map((message: Message) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      roomId: message.roomId,
      userId: message.userId,
      user: message.user,
    }));
  }
}
