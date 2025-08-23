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
import { useSignUp, type SignUpData } from '../../hooks/useAuth';

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username é obrigatório')
      .min(3, 'Username deve ter pelo menos 3 caracteres')
      .max(30, 'Username deve ter no máximo 30 caracteres')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Username deve conter apenas letras, números e underscore'
      ),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .max(100, 'Senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpForm() {
  const signUpMutation = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: SignUpFormData) => {
    const signUpData: SignUpData = {
      username: data.username,
      password: data.password,
    };
    signUpMutation.mutate(signUpData);
  };

  return (
    <Box maxW='400px' mx='auto' p={6}>
      <VStack gap={6} align='stretch'>
        <Box textAlign='center'>
          <Heading size='lg' mb={2}>
            Criar Conta
          </Heading>
          <Text color='gray.600' _dark={{ color: 'gray.400' }}>
            Crie sua conta para começar a conversar
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

            <Box>
              <Text fontSize='sm' fontWeight='medium' mb={2}>
                Confirmar Senha{' '}
                <Text as='span' color='red.500'>
                  *
                </Text>
              </Text>
              <Input
                {...register('confirmPassword')}
                type='password'
                placeholder='Confirme sua senha'
                _invalid={{ borderColor: 'red.500' }}
              />
              {errors.confirmPassword && (
                <Text fontSize='sm' color='red.500' mt={1}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </Box>

            <Button
              type='submit'
              colorScheme='teal'
              size='lg'
              w='full'
              loading={signUpMutation.isPending}
              loadingText='Criando conta...'
              disabled={!isValid}
            >
              Criar Conta
            </Button>
          </VStack>
        </form>

        <Box textAlign='center'>
          <Text fontSize='sm' color='gray.600' _dark={{ color: 'gray.400' }}>
            Já tem uma conta?{' '}
            <ChakraLink
              asChild
              href='/auth/signin'
              color='teal.500'
              fontWeight='medium'
            >
              <Link to='/auth/signin'>Fazer login</Link>
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default SignUpForm;
