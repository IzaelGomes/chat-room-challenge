import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { Message } from '@/types/message';

export interface WebSocketContextType {
  socket: Socket | null;
  messages: Message[];
  isConnected: boolean;
  error: string | null;
  sendMessage: (content: string, roomId: string) => void;
  updateMessage: (messageId: string, content: string, roomId: string) => void;
  deleteMessage: (messageId: string, roomId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);
