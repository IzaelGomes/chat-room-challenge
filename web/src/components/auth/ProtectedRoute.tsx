import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: auth, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <Flex
        h='100vh'
        align='center'
        justify='center'
        direction='column'
        gap={4}
        bg='gray.50'
        _dark={{ bg: 'gray.900' }}
      >
        <Spinner size='xl' color='teal.500' />
        <Text color='gray.600' _dark={{ color: 'gray.400' }}>
          Verificando autenticação...
        </Text>
      </Flex>
    );
  }

  if (error || !auth) {
    return <Navigate to='/auth/signin' replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
