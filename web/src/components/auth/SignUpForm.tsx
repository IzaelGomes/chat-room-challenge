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
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp, type SignUpData } from '../../hooks/useAuth';
import { toaster } from '../ui/toaster';

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
  const { mutateAsync, isPending } = useSignUp();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    const signUpData: SignUpData = {
      username: data.username,
      password: data.password,
    };
    try {
      await mutateAsync(signUpData);
      toaster.success({
        title: 'Conta criada com sucesso',
        description: 'Você pode fazer login agora',
      });
    } catch (error) {
      toaster.error({
        title: 'Erro ao criar conta',
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }
    navigate('/auth/signin');
  };

  return (
    <Box
      maxW={{ base: '90%', sm: '400px' }}
      mx='auto'
      p={{ base: 4, md: 6 }}
      w='full'
    >
      <VStack gap={{ base: 4, md: 6 }} align='stretch'>
        <Box textAlign='center'>
          <Heading size={{ base: 'md', md: 'lg' }} mb={2}>
            Criar Conta
          </Heading>
          <Text
            color='gray.600'
            _dark={{ color: 'gray.400' }}
            fontSize={{ base: 'sm', md: 'md' }}
          >
            Crie sua conta para começar a conversar
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={{ base: 3, md: 4 }} align='stretch'>
            <Box>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight='medium'
                mb={2}
              >
                Username{' '}
                <Text as='span' color='red.500'>
                  *
                </Text>
              </Text>
              <Input
                {...register('username')}
                placeholder='Digite seu username'
                _invalid={{ borderColor: 'red.500' }}
                size={{ base: 'md', md: 'lg' }}
              />
              {errors.username && (
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color='red.500'
                  mt={1}
                >
                  {errors.username.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight='medium'
                mb={2}
              >
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
                size={{ base: 'md', md: 'lg' }}
              />
              {errors.password && (
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color='red.500'
                  mt={1}
                >
                  {errors.password.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text
                fontSize={{ base: 'xs', md: 'sm' }}
                fontWeight='medium'
                mb={2}
              >
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
                size={{ base: 'md', md: 'lg' }}
              />
              {errors.confirmPassword && (
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color='red.500'
                  mt={1}
                >
                  {errors.confirmPassword.message}
                </Text>
              )}
            </Box>

            <Button
              type='submit'
              colorScheme='teal'
              size={{ base: 'md', md: 'lg' }}
              w='full'
              loading={isPending}
              loadingText='Criando conta...'
              disabled={!isValid}
            >
              Criar Conta
            </Button>
          </VStack>
        </form>

        <Box textAlign='center'>
          <Text
            fontSize={{ base: 'xs', md: 'sm' }}
            color='gray.600'
            _dark={{ color: 'gray.400' }}
          >
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
