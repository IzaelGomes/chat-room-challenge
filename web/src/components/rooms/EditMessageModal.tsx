import { useWebSocket } from '@/hooks/useWebSocket';
import {
  Dialog,
  Button,
  Textarea,
  VStack,
  Text,
  Portal,
  CloseButton,
  Box,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { toaster } from '../ui/toaster';

const editMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'O conteúdo da mensagem não pode estar vazio')
    .min(1, 'A mensagem deve ter pelo menos 1 caractere')
    .max(1000, 'A mensagem não pode ter mais de 1000 caracteres')
    .transform((val) => val.trim()),
});

interface EditMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
  messageId: string;
  roomId: string;
}

export default function EditMessageModal({
  isOpen,
  onClose,
  messageContent,
  messageId,
  roomId,
}: EditMessageModalProps) {
  const { updateMessage } = useWebSocket();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(editMessageSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (messageContent) {
      reset({ content: messageContent });
    }
  }, [messageContent, reset]);

  const onSubmit = async (data: z.infer<typeof editMessageSchema>) => {
    try {
      updateMessage(messageId, data.content, roomId);
      handleClose();
      toaster.success({
        title: 'Mensagem atualizada',
        description: 'Mensagem atualizada com sucesso',
      });
    } catch {
      toaster.error({
        title: 'Erro ao atualizar mensagem',
        description: 'Tente novamente mais tarde',
      });
    }
  };

  const handleClose = () => {
    reset({ content: messageContent });
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
              <Dialog.Title>Editar Mensagem</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align='stretch'>
                <Text
                  fontSize='sm'
                  color='gray.600'
                  _dark={{ color: 'gray.400' }}
                >
                  Edite o conteúdo da sua mensagem.
                </Text>

                <Box>
                  <Text fontSize='sm' fontWeight='medium' mb={2}>
                    Mensagem{' '}
                    <Text as='span' color='red.500'>
                      *
                    </Text>
                  </Text>
                  <Textarea
                    {...register('content')}
                    placeholder='Digite sua mensagem...'
                    rows={4}
                    maxLength={1000}
                    borderColor={errors.content ? 'red.500' : 'gray.200'}
                  />
                  {errors.content && (
                    <Text fontSize='sm' color='red.500' mt={1}>
                      {errors.content.message}
                    </Text>
                  )}
                </Box>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline' onClick={handleClose}>
                  Cancelar
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorScheme='blue'
                onClick={handleSubmit(onSubmit)}
                loadingText='Salvando...'
                disabled={!isValid}
              >
                Salvar
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
