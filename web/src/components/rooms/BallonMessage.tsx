import { Box, Text } from '@chakra-ui/react';
import type { Message } from './ChatRoom';
import { useAuth } from '@/hooks/useAuth';
import { formatTime } from '@/utils';

interface BallonMessageProps {
  message: Message;
}

function BallonMessage({ message }: BallonMessageProps) {
  const { data: authData } = useAuth();

  const isSelfUser = message.userId === authData?.user.id;

  return (
    <Box
      key={message.id}
      p={3}
      bg='white'
      borderRadius='lg'
      border='1px'
      borderColor='gray.200'
      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
      maxW='80%'
      alignSelf={isSelfUser ? 'flex-end' : 'flex-start'}
    >
      <Text fontSize='sm' fontWeight='medium' mb={1}>
        {message.user?.username ||
          `Usuário (${message.user.username || 'Usuário'})`}
        <Text as='span' fontSize='xs' color='gray.500' ml={2}>
          {formatTime(message.createdAt)}
        </Text>
      </Text>
      <Text>{message.content}</Text>
    </Box>
  );
}

export default BallonMessage;
