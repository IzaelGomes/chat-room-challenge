import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { toaster } from '@/components/ui/toaster';

interface Message {
  id: string;
  content: string;
  roomId: string;
  userId: string;
  user: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UseWebSocketProps {
  roomId?: string;
}

export const useWebSocket = ({ roomId }: UseWebSocketProps = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const { data: authData } = useAuth();

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const newSocket = io(apiUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socketRef.current = newSocket;
    setSocket(newSocket);

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
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join-room', roomId, authData?.user);

      return () => {
        socket.emit('leave-room', roomId, authData?.user);
        setMessages([]);
      };
    }
  }, [socket, roomId, authData?.user]);

  const sendMessage = (content: string) => {
    if (socket && roomId && content.trim() && authData) {
      socket.emit('send-message', {
        roomId,
        content: content.trim(),
        user: authData.user,
      });
    } else {
      toaster.create({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar a mensagem',
      });
    }
  };

  const joinRoom = (newRoomId: string) => {
    if (socket) {
      if (roomId) {
        socket.emit('leave-room', roomId);
      }
      socket.emit('join-room', newRoomId);
      setMessages([]);
      setError(null);
    }
  };

  return {
    socket,
    messages,
    isConnected,
    error,
    sendMessage,
    joinRoom,
  };
};
