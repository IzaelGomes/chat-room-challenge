import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { data: auth, isLoading } = useAuth();

  return (
    <Box p={8} maxW='800px' mx='auto'>
      <VStack gap={6} align='stretch'>
        <Heading size='2xl' textAlign='center' color='teal.500'>
          Chat Room
        </Heading>
        <Text
          fontSize='lg'
          textAlign='center'
          color='gray.600'
          _dark={{ color: 'gray.400' }}
        >
          Bem-vindo ao nosso chat room! Conecte-se e converse com outros
          usuários.
        </Text>

        {!isLoading && (
          <VStack gap={4}>
            {auth ? (
              <VStack gap={3}>
                <Text color='gray.700' _dark={{ color: 'gray.300' }}>
                  Olá, {auth.user.username}!
                </Text>
                <Link to='/rooms'>
                  <Button colorScheme='teal' size='lg' w='200px'>
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
                >
                  Faça login ou crie uma conta para começar a conversar
                </Text>
                <HStack gap={3}>
                  <Link to='/auth/signin'>
                    <Button colorScheme='teal' size='lg' w='150px'>
                      Entrar
                    </Button>
                  </Link>
                  <Link to='/auth/signup'>
                    <Button
                      variant='outline'
                      colorScheme='teal'
                      size='lg'
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
