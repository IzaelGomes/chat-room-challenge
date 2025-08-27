import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Heading,
} from '@chakra-ui/react';
import { FiSend, FiHash } from 'react-icons/fi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useRoom } from '../../hooks/useRooms';
import { useAuth } from '../../hooks/useAuth';
import BallonMessage from './BallonMessage';
import type { Message } from '@/types/message';
import InputMessage from './InputMessage';

interface ChatRoomProps {
  roomId: string;
}

function ChatRoom({ roomId }: ChatRoomProps) {
  const [message, setMessage] = useState('');
  const messagesContainerBottomRef = useRef<HTMLDivElement>(null);

  const {
    data: room,
    isLoading: isLoadingRoom,
    error: roomError,
    isError: isErrorRoom,
  } = useRoom(roomId);
  const {
    messages,
    isConnected,
    error: errorWebSocket,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useWebSocket();
  const { data: authData } = useAuth();

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
    }

    return () => {
      leaveRoom(roomId);
    };
  }, [roomId, joinRoom, leaveRoom]);

  const scrollToBottom = useCallback(() => {
    messagesContainerBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      sendMessage(message, roomId);
      setMessage('');
    }
  }, [message, sendMessage, roomId]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
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

  if (isErrorRoom) {
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
        p={{ base: 3, md: 4 }}
        borderBottom='1px'
        borderColor='gray.200'
        bg='white'
        _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
      >
        <HStack>
          <FiHash color='var(--chakra-colors-teal-500)' />
          <Heading size={{ base: 'sm', md: 'md' }} color='teal.500'>
            {room?.name}
          </Heading>
          {!isConnected && (
            <Text fontSize='xs' color='red.500'>
              Desconectado
            </Text>
          )}
        </HStack>
      </Box>

      {errorWebSocket && (
        <Box p={{ base: 3, md: 4 }}>
          <Box
            p={3}
            bg='red.50'
            borderRadius='md'
            border='1px'
            borderColor='red.200'
            _dark={{ bg: 'red.900', borderColor: 'red.700' }}
          >
            <Text fontSize='sm' color='red.600' _dark={{ color: 'red.400' }}>
              {errorWebSocket}
            </Text>
          </Box>
        </Box>
      )}

      <VStack
        flex='1'
        p={{ base: 3, md: 4 }}
        align='stretch'
        gap={3}
        overflowY='auto'
        bg='gray.50'
        _dark={{ bg: 'gray.900' }}
      >
        {messages.length === 0 ? (
          <Flex align='center' justify='center' h='full'>
            <Text
              color='gray.500'
              _dark={{ color: 'gray.400' }}
              fontSize={{ base: 'sm', md: 'md' }}
              textAlign='center'
              px={4}
            >
              Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
            </Text>
          </Flex>
        ) : (
          messages.map((message: Message) => (
            <BallonMessage key={message.id} message={message} />
          ))
        )}
        <Box ref={messagesContainerBottomRef} />
      </VStack>

      <Box
        p={{ base: 3, md: 4 }}
        borderTop='1px'
        borderColor='gray.200'
        bg='white'
        _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
      >
        <HStack gap={2}>
          <InputMessage
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder='Digite sua mensagem...'
            disabled={!isConnected || !authData}
            maxLength={500}
          />
          <Button
            colorScheme='teal'
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected || !authData}
            minW='auto'
            size={{ base: 'sm', md: 'md' }}
          >
            <FiSend />
          </Button>
        </HStack>
        <Text
          fontSize='xs'
          color='gray.500'
          mt={1}
          display={{ base: 'none', sm: 'block' }}
        >
          Pressione Enter para enviar, Shift+Enter para nova linha
        </Text>
      </Box>
    </Flex>
  );
}

export default ChatRoom;
