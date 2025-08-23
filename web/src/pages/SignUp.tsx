import { Box, Flex } from '@chakra-ui/react';
import SignUpForm from '../components/auth/SignUpForm';

function SignUp() {
  return (
    <Flex
      minH='100vh'
      align='center'
      justify='center'
      bg='gray.50'
      _dark={{ bg: 'gray.900' }}
      p={4}
    >
      <Box
        w='full'
        maxW='md'
        bg='white'
        _dark={{ bg: 'gray.800' }}
        borderRadius='lg'
        boxShadow='lg'
        p={8}
      >
        <SignUpForm />
      </Box>
    </Flex>
  );
}

export default SignUp;
