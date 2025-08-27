import React, { useMemo, useState, useCallback } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import type { Message } from '@/types/message';
import { useAuth } from '@/hooks/useAuth';
import { formatTime } from '@/utils';
import EditMessageModal from './EditMessageModal';
import DeleteMessageConfirm from './DeleteMessageConfirm';
import MessageOptionsMenu from './MessageOptionsMenu';

interface BallonMessageProps {
  message: Message;
}

function BallonMessage({ message }: BallonMessageProps) {
  const { data: authData } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isSelfUser = useMemo(
    () => message.userId === authData?.user.id,
    [message.userId, authData?.user.id]
  );

  const handleEdit = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  return (
    <>
      <Box
        key={message.id}
        p={{ base: 2, md: 3 }}
        bg='white'
        borderRadius='lg'
        border='1px'
        borderColor='gray.200'
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        maxW={{ base: '90%', sm: '85%', md: '80%' }}
        alignSelf={isSelfUser ? 'flex-end' : 'flex-start'}
        _hover={{
          '& .message-actions': {
            opacity: 1,
          },
        }}
      >
        <Flex justify='space-between' align='center' mb={2} gap={2}>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            fontWeight='medium'
            overflow='hidden'
            textOverflow='ellipsis'
            whiteSpace='nowrap'
            maxW='150px'
          >
            {message.user?.username || 'Usuário'}
          </Text>

          {isSelfUser && (
            <MessageOptionsMenu onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Flex>

        <Text mb={2} fontSize={{ base: 'sm', md: 'md' }} wordBreak='break-word'>
          {message.content}
        </Text>

        <Flex justify='flex-end'>
          <Text fontSize={{ base: '2xs', sm: 'xs' }} color='gray.500'>
            {formatTime(message.createdAt)}
          </Text>
        </Flex>
      </Box>

      <EditMessageModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        messageContent={message.content}
        messageId={message.id}
        roomId={message.roomId}
      />

      <DeleteMessageConfirm
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        messageId={message.id}
        roomId={message.roomId}
      />
    </>
  );
}

export default React.memo(BallonMessage);
