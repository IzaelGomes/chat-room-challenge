import {
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
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
          <ChakraLink as={Link} href='/chat' colorScheme='teal' w='200px'>
            Entrar no Chat
          </ChakraLink>
        </VStack>
      </VStack>
    </Box>
  );
}

export default Home;
