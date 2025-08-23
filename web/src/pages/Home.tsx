import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box p={8} maxW='800px' mx='auto'>
      <VStack gap={6} align='stretch'>
        <Heading size='2xl' textAlign='center' color='teal.500'>
          Chat Room
        </Heading>
        <Text fontSize='lg' textAlign='center' color='gray.600'>
          Bem-vindo ao nosso chat room! Conecte-se e converse com outros
          usuários.
        </Text>
        <VStack gap={4}>
          <Link to='/rooms'>
            <Button colorScheme='teal' size='lg' w='200px'>
              Entrar nas Salas
            </Button>
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}

export default Home;
