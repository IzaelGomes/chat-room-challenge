export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  roomId: string;
  userId: string;
  user?: {
    id: string;
    username: string;
  };
};

export interface MessageRepositoryInterface {
  createMessage(message: Message): Promise<Message>;
  getMessagesByRoomId(roomId: string): Promise<Message[]>;
  updateMessage(messageId: string, content: string): Promise<Message>;
  deleteMessage(messageId: string): Promise<void>;
  findMessageById(messageId: string): Promise<Message | null>;
}
