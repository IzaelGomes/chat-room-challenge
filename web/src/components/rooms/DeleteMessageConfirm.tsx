import { useWebSocket } from '@/hooks/useWebSocket';
import {
  Dialog,
  Button,
  Text,
  VStack,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '../ui/toaster';

interface DeleteMessageConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  roomId: string;
}

export default function DeleteMessageConfirm({
  isOpen,
  onClose,
  messageId,
  roomId,
}: DeleteMessageConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteMessage } = useWebSocket();

  const handleDelete = () => {
    setIsDeleting(true);

    try {
      deleteMessage(messageId, roomId);
      toaster.success({
        title: 'Mensagem deletada',
        description: 'Mensagem deletada com sucesso',
      });
      onClose();
    } catch {
      toaster.error({
        title: 'Erro ao deletar mensagem',
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
      size='md'
      placement='center'
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Deletar Mensagem</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align='stretch'>
                <Text
                  fontSize='sm'
                  color='gray.600'
                  _dark={{ color: 'gray.400' }}
                >
                  Tem certeza que deseja deletar esta mensagem? Esta ação não
                  pode ser desfeita.
                </Text>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' onClick={handleClose}>
                  Cancelar
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorScheme='red'
                onClick={handleDelete}
                loading={isDeleting}
                loadingText='Deletando...'
              >
                Deletar
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
