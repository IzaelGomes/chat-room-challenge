import {
  Box,
  Heading,
  Text,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Box p={8} maxW='800px' mx='auto' textAlign='center'>
      <VStack gap={6}>
        <Heading size='3xl' color='red.500'>
          404
        </Heading>
        <Heading size='xl' color='gray.600'>
          Página não encontrada
        </Heading>
        <Text fontSize='lg' color='gray.500'>
          A página que você está procurando não existe ou foi removida.
        </Text>
        <ChakraLink as={Link} href='/' colorScheme='teal'>
          Voltar para Home
        </ChakraLink>
      </VStack>
    </Box>
  );
}

export default NotFound;
