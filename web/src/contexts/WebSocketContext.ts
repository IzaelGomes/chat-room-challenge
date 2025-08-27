import { createContext } from 'react';
import type { Socket } from 'socket.io-client';
import type { Message } from '@/types/message';

export interface WebSocketContextType {
  socket: Socket | null;
  messages: Message[];
  isConnected: boolean;
  error: string | null;
  currentRoomId: string | null;
  sendMessage: (content: string) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);
