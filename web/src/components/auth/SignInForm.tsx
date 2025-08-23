import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useSignIn, type SignInData } from '../../hooks/useAuth';

const signInSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignInForm() {
  const signInMutation = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignInFormData) => {
    const signInData: SignInData = {
      username: data.username,
      password: data.password,
    };
    signInMutation.mutate(signInData);
  };

  return (
    <Box maxW='400px' mx='auto' p={6}>
      <VStack gap={6} align='stretch'>
        <Box textAlign='center'>
          <Heading size='lg' mb={2}>
            Entrar
          </Heading>
          <Text color='gray.600' _dark={{ color: 'gray.400' }}>
            Faça login para continuar
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={4} align='stretch'>
            <Box>
              <Text fontSize='sm' fontWeight='medium' mb={2}>
                Username{' '}
                <Text as='span' color='red.500'>
                  *
                </Text>
              </Text>
              <Input
                {...register('username')}
                placeholder='Digite seu username'
                _invalid={{ borderColor: 'red.500' }}
              />
              {errors.username && (
                <Text fontSize='sm' color='red.500' mt={1}>
                  {errors.username.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize='sm' fontWeight='medium' mb={2}>
                Senha{' '}
                <Text as='span' color='red.500'>
                  *
                </Text>
              </Text>
              <Input
                {...register('password')}
                type='password'
                placeholder='Digite sua senha'
                _invalid={{ borderColor: 'red.500' }}
              />
              {errors.password && (
                <Text fontSize='sm' color='red.500' mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </Box>

            <Button
              type='submit'
              colorScheme='teal'
              size='lg'
              w='full'
              loading={signInMutation.isPending}
              loadingText='Entrando...'
              disabled={!isValid}
            >
              Entrar
            </Button>
          </VStack>
        </form>

        <Box textAlign='center'>
          <Text fontSize='sm' color='gray.600' _dark={{ color: 'gray.400' }}>
            Não tem uma conta?{' '}
            <ChakraLink
              asChild
              href='/auth/signup'
              color='teal.500'
              fontWeight='medium'
            >
              <Link to='/auth/signup'>Criar conta</Link>
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default SignInForm;
