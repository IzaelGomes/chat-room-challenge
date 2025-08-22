import { Message } from './message-repository-interface';

export type Room = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
};
export interface RoomRepositoryInterface {
  createRoom(room: Room): Promise<Room>;
  getRoomById(id: string): Promise<Room | null>;
  getRooms(): Promise<Room[]>;
}
