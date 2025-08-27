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

  async updateMessage(messageId: string, content: string): Promise<Message> {
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return {
      id: updatedMessage.id,
      content: updatedMessage.content,
      createdAt: updatedMessage.createdAt,
      updatedAt: updatedMessage.updatedAt,
      roomId: updatedMessage.roomId,
      userId: updatedMessage.userId,
      user: updatedMessage.user,
    };
  }

  async deleteMessage(messageId: string): Promise<void> {
    await prisma.message.delete({
      where: { id: messageId },
    });
  }

  async findMessageById(messageId: string): Promise<Message | null> {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!message) {
      return null;
    }

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      roomId: message.roomId,
      userId: message.userId,
      user: message.user,
    };
  }
}
