import { Box, Text, VStack, Flex, Icon, Button } from '@chakra-ui/react';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import ChatLayout from '../components/layout/ChatLayout';
import { useState } from 'react';
import CreateRoomModal from '../components/rooms/CreateRoomModal';

function Rooms() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <ChatLayout>
      <Flex h='full' align='center' justify='center' p={{ base: 4, md: 8 }}>
        <VStack
          gap={{ base: 6, md: 8 }}
          textAlign='center'
          maxW='500px'
          w='full'
        >
          <Box>
            <Icon
              as={FiMessageSquare}
              boxSize={{ base: '48px', md: '64px' }}
              color='teal.500'
              mb={4}
            />
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight='bold' mb={2}>
              Bem-vindo ao Chat Rooms!
            </Text>
            <Text
              color='gray.600'
              _dark={{ color: 'gray.400' }}
              fontSize={{ base: 'md', md: 'lg' }}
            >
              Conecte-se com outras pessoas em salas de conversa organizadas por
              tópicos.
            </Text>
          </Box>

          <VStack gap={4} w='full'>
            <Box
              p={{ base: 4, md: 6 }}
              bg='white'
              borderRadius='lg'
              border='1px'
              borderColor='gray.200'
              _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
              w='full'
            >
              <Flex align='center' mb={3}>
                <Icon as={FiPlus} mr={3} color='teal.500' />
                <Text fontWeight='semibold' fontSize={{ base: 'sm', md: 'md' }}>
                  Criar Nova Sala
                </Text>
              </Flex>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                color='gray.600'
                _dark={{ color: 'gray.400' }}
                mb={4}
              >
                Comece criando uma sala para conversar sobre seus tópicos
                favoritos.
              </Text>
              <Button
                colorScheme='teal'
                w='full'
                size={{ base: 'md', md: 'lg' }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Criar Primeira Sala
              </Button>
            </Box>
          </VStack>
        </VStack>
      </Flex>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </ChatLayout>
  );
}

export default Rooms;
