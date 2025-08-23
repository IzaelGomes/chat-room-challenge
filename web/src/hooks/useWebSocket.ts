import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

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

    const newSocket = io(apiUrl);
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Conectado ao WebSocket');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado do WebSocket');
      setIsConnected(false);
    });

    newSocket.on('error', (errorData: { message: string }) => {
      console.error('Erro do WebSocket:', errorData.message);
      setError(errorData.message);
    });

    newSocket.on('room-messages', (roomMessages: Message[]) => {
      console.log('Mensagens da sala recebidas:', roomMessages);
      setMessages(roomMessages);
    });

    newSocket.on('new-message', (message: Message) => {
      console.log('Nova mensagem recebida:', message);
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('user-joined', (data: { userId: string; roomId: string }) => {
      console.log('Usuário entrou na sala:', data);
    });

    newSocket.on('user-left', (data: { userId: string; roomId: string }) => {
      console.log('Usuário saiu da sala:', data);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && roomId) {
      console.log('Entrando na sala:', roomId);
      socket.emit('join-room', roomId);

      return () => {
        console.log('Saindo da sala:', roomId);
        socket.emit('leave-room', roomId);
        setMessages([]);
      };
    }
  }, [socket, roomId]);

  const sendMessage = (content: string) => {
    if (socket && roomId && content.trim() && authData) {
      console.log('Enviando mensagem via WebSocket...');
      socket.emit('send-message', {
        roomId,
        content: content.trim(),
        user: authData.user,
      });
    } else {
      console.warn('Condições não atendidas para enviar mensagem:', {
        hasSocket: !!socket,
        hasRoomId: !!roomId,
        hasContent: !!content.trim(),
        hasAuth: !!authData,
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
