import { prisma } from '../config/prisma';
import {
  Room,
  RoomRepositoryInterface,
} from '../../app/repository/room-repository-interface';
import { Message } from '../../app/repository/message-repository-interface';

export class RoomRepository implements RoomRepositoryInterface {
  async createRoom(
    room: Omit<Room, 'id' | 'updatedAt' | 'messages'>
  ): Promise<Room> {
    const createdRoom = await prisma.room.create({
      data: {
        name: room.name,
        createdAt: room.createdAt,
      },
      include: {
        messages: true,
      },
    });

    return {
      id: createdRoom.id,
      name: createdRoom.name,
      createdAt: createdRoom.createdAt,
      updatedAt: createdRoom.updatedAt,
      messages: createdRoom.messages.map((message: Message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        roomId: message.roomId,
        userId: message.userId,
        user: message.user,
      })),
    };
  }

  async getRoomById(id: string): Promise<Room | null> {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return null;
    }

    return {
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      messages: room.messages.map((message: any) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        roomId: message.roomId,
        userId: message.userId,
        user: message.user,
      })),
    };
  }

  async getRooms(): Promise<Room[]> {
    const rooms = await prisma.room.findMany({
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rooms.map((room: any) => ({
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      messages: room.messages.map((message: any) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        roomId: message.roomId,
        userId: message.userId,
        user: message.user,
      })),
    }));
  }

  async findRoomByName(name: string): Promise<Room | null> {
    const room = await prisma.room.findFirst({
      where: { name },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!room) {
      return null;
    }

    return {
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      messages: room.messages.map((message: Message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        roomId: message.roomId,
        userId: message.userId,
        user: message.user,
      })),
    };
  }
}
