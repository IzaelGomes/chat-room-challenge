import {
  Box,
  VStack,
  Text,
  Button,
  Flex,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import { FiPlus, FiHash } from 'react-icons/fi';
import { useRooms } from '../../hooks/useRooms';
import { useState } from 'react';
import CreateRoomModal from '../rooms/CreateRoomModal';

function Sidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: rooms, isLoading, error } = useRooms();

  return (
    <>
      <Flex direction='column' h='full'>
        <Box
          p={4}
          borderBottom='1px'
          borderColor='gray.200'
          _dark={{ borderColor: 'gray.700' }}
        >
          <Flex align='center' justify='space-between'>
            <Heading size='md' color='teal.500'>
              Chat Rooms
            </Heading>
            <Button
              aria-label='Criar nova sala'
              size='sm'
              variant='ghost'
              colorScheme='teal'
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus />
            </Button>
          </Flex>
        </Box>

        <VStack flex='1' p={3} align='stretch' gap={1} overflowY='auto'>
          <Text
            fontSize='xs'
            fontWeight='bold'
            color='gray.600'
            _dark={{ color: 'gray.400' }}
            px={2}
            py={1}
          >
            SALAS DE TEXTO
          </Text>

          {isLoading && (
            <>
              <Skeleton height='32px' borderRadius='md' />
              <Skeleton height='32px' borderRadius='md' />
              <Skeleton height='32px' borderRadius='md' />
            </>
          )}

          {error && (
            <Box
              p={3}
              bg='red.50'
              borderRadius='md'
              border='1px'
              borderColor='red.200'
              _dark={{ bg: 'red.900', borderColor: 'red.700' }}
            >
              <Text fontSize='sm' color='red.600' _dark={{ color: 'red.400' }}>
                Erro ao carregar salas
              </Text>
            </Box>
          )}

          {rooms && rooms.length === 0 && (
            <Box p={4} textAlign='center'>
              <Text
                fontSize='sm'
                color='gray.600'
                _dark={{ color: 'gray.400' }}
              >
                Nenhuma sala encontrada
              </Text>
              <Button
                size='sm'
                variant='ghost'
                colorScheme='teal'
                mt={2}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Criar primeira sala
              </Button>
            </Box>
          )}

          {rooms?.map((room) => (
            <Button
              key={room.id}
              variant='ghost'
              justifyContent='flex-start'
              size='sm'
              fontWeight='normal'
              color='gray.600'
              _dark={{ color: 'gray.400' }}
              _hover={{ bg: 'gray.200', _dark: { bg: 'gray.700' } }}
              borderRadius='md'
            >
              <Flex align='center' w='full'>
                <FiHash style={{ marginRight: '8px' }} />
                <Text truncate>{room.name}</Text>
              </Flex>
            </Button>
          ))}
        </VStack>

        <Box
          p={3}
          borderTop='1px'
          borderColor='gray.200'
          _dark={{ borderColor: 'gray.700' }}
        >
          <Button
            w='full'
            colorScheme='teal'
            variant='outline'
            size='sm'
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Flex align='center'>
              <FiPlus style={{ marginRight: '8px' }} />
              Nova Sala
            </Flex>
          </Button>
        </Box>
      </Flex>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}

export default Sidebar;
