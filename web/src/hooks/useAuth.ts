import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../components/ui/toaster';

interface User {
  id: string;
  username: string;
}

interface AuthResponse {
  user: User;
}

interface SignUpData {
  username: string;
  password: string;
}

interface SignInData {
  username: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar conta');
    }

    return response.json();
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    return response.json();
  },

  signOut: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erro ao fazer logout');
    }
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Não autenticado');
    }

    return response.json();
  },
};

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      toaster.create({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo, ${data.user.username}!`,
        type: 'success',
        duration: 3000,
      });
      navigate('/auth/signin');
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Erro ao criar conta',
        description: error.message,
        type: 'error',
        duration: 5000,
      });
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], data);
      toaster.create({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo de volta, ${data.user.username}!`,
        type: 'success',
        duration: 3000,
      });
      navigate('/rooms');
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Erro ao fazer login',
        description: error.message,
        type: 'error',
        duration: 5000,
      });
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.setQueryData(['auth'], null);
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toaster.create({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
        type: 'info',
        duration: 3000,
      });
      navigate('/');
    },
    onError: (error: Error) => {
      toaster.create({
        title: 'Erro ao fazer logout',
        description: error.message,
        type: 'error',
        duration: 5000,
      });
    },
  });
};

export type { User, SignUpData, SignInData };
