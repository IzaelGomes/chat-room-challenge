import {
  Dialog,
  Button,
  Input,
  VStack,
  Text,
  Box,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRoom, type CreateRoomData } from '../../hooks/useRooms';
import { toaster } from '../ui/toaster';

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome da sala é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .transform((val) => val.trim()),
});

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const createRoomMutation = useCreateRoom();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(createRoomSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof createRoomSchema>) => {
    try {
      await createRoomMutation.mutateAsync({
        name: data.name,
      } as CreateRoomData);

      toaster.create({
        title: 'Sala criada com sucesso!',
        description: `A sala "${data.name}" foi criada.`,
        type: 'success',
        duration: 3000,
      });

      handleClose();
    } catch (error) {
      toaster.create({
        title: 'Error',
        description:
          (error as Error).message ||
          'Não foi possível criar a sala. Tente novamente.',
        type: 'error',
        duration: 5000,
      });
    }
  };

  const handleClose = () => {
    reset();
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
              <Dialog.Title>Criar Nova Sala</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} align='stretch'>
                <Text
                  fontSize='sm'
                  color='gray.600'
                  _dark={{ color: 'gray.400' }}
                >
                  Crie uma nova sala para conversar com outros usuários.
                </Text>

                <Box>
                  <Text fontSize='sm' fontWeight='medium' mb={2}>
                    Nome da Sala{' '}
                    <Text as='span' color='red.500'>
                      *
                    </Text>
                  </Text>
                  <Input
                    {...register('name')}
                    placeholder='Ex: sala-geral, discussões, etc.'
                    maxLength={50}
                    borderColor={errors.name ? 'red.500' : 'gray.200'}
                  />
                  {errors.name && (
                    <Text fontSize='sm' color='red.500' mt={1}>
                      {errors.name.message}
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
                colorScheme='teal'
                onClick={handleSubmit(onSubmit)}
                loading={createRoomMutation.isPending}
                loadingText='Criando...'
                disabled={!isValid}
              >
                Criar Sala
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

export default CreateRoomModal;
