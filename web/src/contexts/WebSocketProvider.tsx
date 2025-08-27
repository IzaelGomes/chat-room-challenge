import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { toaster } from '@/components/ui/toaster';
import type { Message } from '@/types/message';
import {
  WebSocketContext,
  type WebSocketContextType,
} from './WebSocketContext';

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { data: authData } = useAuth();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const newSocket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('error', (errorData: { message: string }) => {
      setError(errorData.message);
    });

    newSocket.on('room-messages', (roomMessages: Message[]) => {
      setMessages(roomMessages);
    });

    newSocket.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('message-updated', (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
      );
    });

    newSocket.on('message-deleted', (messageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    newSocket.on(
      'user-joined',
      (data: { userId: string; username: string; roomId: string }) => {
        toaster.create({
          type: 'success',
          title: 'Usuário entrou na sala',
          description: `${data.username} entrou na sala`,
        });
      }
    );

    newSocket.on(
      'user-left',
      (data: { userId: string; username: string; roomId: string }) => {
        toaster.create({
          type: 'info',
          title: 'Usuário saiu da sala',
          description: `${data.username} saiu da sala`,
        });
      }
    );

    return () => {
      newSocket.off('disconnect');
      newSocket.off('connect');
      newSocket.off('room-messages');
      newSocket.off('new-message');
      newSocket.off('message-updated');
      newSocket.off('message-deleted');
      newSocket.off('user-joined');
      newSocket.off('user-left');
      newSocket.off('error');
      newSocket.close();
    };
  }, []);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socketRef.current && roomId && authData?.user) {
        socketRef.current.emit('join-room', roomId, authData.user);
        setCurrentRoomId(roomId);
        setMessages([]);
        setError(null);
      }
    },
    [authData?.user]
  );

  const leaveRoom = useCallback(() => {
    if (socketRef.current && currentRoomId && authData?.user) {
      socketRef.current.emit('leave-room', currentRoomId, authData.user);
      setCurrentRoomId(null);
      setMessages([]);
    }
  }, [currentRoomId, authData?.user]);

  const sendMessage = useCallback(
    (content: string) => {
      if (socketRef.current && currentRoomId && content.trim() && authData) {
        socketRef.current.emit('send-message', {
          roomId: currentRoomId,
          content: content.trim(),
          user: authData.user,
        });
      } else {
        toaster.create({
          title: 'Erro ao enviar mensagem',
          description: 'Não foi possível enviar a mensagem',
        });
      }
    },
    [currentRoomId, authData]
  );

  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      if (socketRef.current && currentRoomId) {
        socketRef.current.emit('update-message', {
          messageId,
          content: content.trim(),
          user: authData?.user,
          roomId: currentRoomId,
        });
      } else {
        toaster.create({
          title: 'Erro ao atualizar mensagem',
          description: 'Não foi possível atualizar a mensagem',
        });
      }
    },
    [currentRoomId, authData]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (socketRef.current && currentRoomId && authData) {
        socketRef.current.emit('delete-message', {
          messageId,
          user: authData.user,
          roomId: currentRoomId,
        });
      } else {
        toaster.create({
          title: 'Erro ao deletar mensagem',
          description: 'Não foi possível deletar a mensagem',
        });
      }
    },
    [currentRoomId, authData]
  );

  const value = useMemo<WebSocketContextType>(
    () => ({
      socket: socketRef.current,
      messages,
      isConnected,
      error,
      currentRoomId,
      sendMessage,
      updateMessage,
      deleteMessage,
      joinRoom,
      leaveRoom,
    }),
    [
      messages,
      isConnected,
      error,
      currentRoomId,
      sendMessage,
      updateMessage,
      deleteMessage,
      joinRoom,
      leaveRoom,
    ]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
