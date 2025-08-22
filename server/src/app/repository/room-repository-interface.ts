import { Message } from './message-repository-interface';

export type Room = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
};
export interface RoomRepositoryInterface {
  createRoom(room: Omit<Room, 'id' | 'updatedAt' | 'messages'>): Promise<Room>;
  getRoomById(id: string): Promise<Room | null>;
  getRooms(): Promise<Room[]>;
  findRoomByName(name: string): Promise<Room | null>;
}
