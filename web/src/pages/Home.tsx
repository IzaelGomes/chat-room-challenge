import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { data: auth, isLoading } = useAuth();

  return (
    <Box p={{ base: 4, md: 8 }} maxW='800px' mx='auto' w='full'>
      <VStack gap={{ base: 4, md: 6 }} align='stretch'>
        <Heading
          size={{ base: 'xl', md: '2xl' }}
          textAlign='center'
          color='teal.500'
        >
          Chat Room
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          textAlign='center'
          color='gray.600'
          _dark={{ color: 'gray.400' }}
        >
          Bem-vindo ao nosso chat room! Conecte-se e converse com outros
          usuários.
        </Text>

        {!isLoading && (
          <VStack gap={{ base: 3, md: 4 }}>
            {auth ? (
              <VStack gap={3}>
                <Text
                  color='gray.700'
                  _dark={{ color: 'gray.300' }}
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  Olá, {auth.user.username}!
                </Text>
                <Link to='/rooms'>
                  <Button
                    colorScheme='teal'
                    size={{ base: 'md', md: 'lg' }}
                    w={{ base: '180px', md: '200px' }}
                  >
                    Entrar nas Salas
                  </Button>
                </Link>
              </VStack>
            ) : (
              <VStack gap={4}>
                <Text
                  textAlign='center'
                  color='gray.600'
                  _dark={{ color: 'gray.400' }}
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  Faça login ou crie uma conta para começar a conversar
                </Text>
                <VStack gap={3} display={{ base: 'flex', sm: 'none' }}>
                  <Link to='/auth/signin'>
                    <Button
                      colorScheme='teal'
                      size={{ base: 'md', md: 'lg' }}
                      w='full'
                    >
                      Entrar
                    </Button>
                  </Link>
                  <Link to='/auth/signup'>
                    <Button
                      variant='outline'
                      colorScheme='teal'
                      size={{ base: 'md', md: 'lg' }}
                      w='full'
                    >
                      Criar Conta
                    </Button>
                  </Link>
                </VStack>

                <HStack gap={3} display={{ base: 'none', sm: 'flex' }}>
                  <Link to='/auth/signin'>
                    <Button
                      colorScheme='teal'
                      size={{ base: 'md', md: 'lg' }}
                      w='150px'
                    >
                      Entrar
                    </Button>
                  </Link>
                  <Link to='/auth/signup'>
                    <Button
                      variant='outline'
                      colorScheme='teal'
                      size={{ base: 'md', md: 'lg' }}
                      w='150px'
                    >
                      Criar Conta
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default Home;
