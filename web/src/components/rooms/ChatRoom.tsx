import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Heading,
} from '@chakra-ui/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSend, FiHash } from 'react-icons/fi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useRoom } from '../../hooks/useRooms';
import { useAuth } from '../../hooks/useAuth';
import BallonMessage from './BallonMessage';

interface ChatRoomProps {
  roomId: string;
}

export interface Message {
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

function ChatRoom({ roomId }: ChatRoomProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: room,
    isLoading: isLoadingRoom,
    error: roomError,
  } = useRoom(roomId);
  const {
    messages,
    isConnected,
    error: wsError,
    sendMessage,
  } = useWebSocket({ roomId });
  const { data: authData } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  }, [messageInput, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  if (isLoadingRoom) {
    return (
      <Flex direction='column' h='full' p={4}>
        <VStack gap={4} align='stretch' h='full'>
          <Skeleton height='40px' />
          <SkeletonText noOfLines={10} />
          <Skeleton height='48px' />
        </VStack>
      </Flex>
    );
  }

  if (roomError) {
    return (
      <Flex h='full' align='center' justify='center' p={8}>
        <Box
          p={4}
          bg='red.50'
          borderRadius='md'
          border='1px'
          borderColor='red.200'
          maxW='400px'
          _dark={{ bg: 'red.900', borderColor: 'red.700' }}
        >
          <Text fontWeight='bold' color='red.600' _dark={{ color: 'red.400' }}>
            Erro ao carregar sala
          </Text>
          <Text fontSize='sm' color='red.600' _dark={{ color: 'red.400' }}>
            {roomError instanceof Error
              ? roomError.message
              : 'Sala não encontrada'}
          </Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction='column' h='full'>
      <Box
        p={4}
        borderBottom='1px'
        borderColor='gray.200'
        bg='white'
        _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
      >
        <HStack>
          <FiHash color='var(--chakra-colors-teal-500)' />
          <Heading size='md' color='teal.500'>
            {room?.name}
          </Heading>
          {!isConnected && (
            <Text fontSize='xs' color='red.500'>
              Desconectado
            </Text>
          )}
        </HStack>
      </Box>

      {wsError && (
        <Box p={4}>
          <Box
            p={3}
            bg='red.50'
            borderRadius='md'
            border='1px'
            borderColor='red.200'
            _dark={{ bg: 'red.900', borderColor: 'red.700' }}
          >
            <Text fontSize='sm' color='red.600' _dark={{ color: 'red.400' }}>
              {wsError}
            </Text>
          </Box>
        </Box>
      )}

      <VStack
        flex='1'
        p={4}
        align='stretch'
        gap={3}
        overflowY='auto'
        bg='gray.50'
        _dark={{ bg: 'gray.900' }}
      >
        {messages.length === 0 ? (
          <Flex align='center' justify='center' h='full'>
            <Text color='gray.500' _dark={{ color: 'gray.400' }}>
              Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
            </Text>
          </Flex>
        ) : (
          messages.map((message: Message) => (
            <BallonMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </VStack>

      <Box
        p={4}
        borderTop='1px'
        borderColor='gray.200'
        bg='white'
        _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
      >
        <HStack gap={2}>
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder='Digite sua mensagem...'
            disabled={!isConnected || !authData}
            maxLength={500}
          />
          <Button
            colorScheme='teal'
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected || !authData}
            minW='auto'
          >
            <FiSend />
          </Button>
        </HStack>
        <Text fontSize='xs' color='gray.500' mt={1}>
          Pressione Enter para enviar, Shift+Enter para nova linha
        </Text>
      </Box>
    </Flex>
  );
}

export default ChatRoom;
