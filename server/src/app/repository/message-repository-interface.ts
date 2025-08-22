export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
};

export interface MessageRepositoryInterface {
  createMessage(message: Message): Promise<Message>;
  getMessagesByRoomId(roomId: string): Promise<Message[]>;
}
