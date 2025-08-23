import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Room {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRoomData {
  name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const roomsApi = {
  getRooms: async (): Promise<Room[]> => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar salas');
    }
    return response.json();
  },

  createRoom: async (data: CreateRoomData): Promise<Room> => {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erro ao criar sala');
    }
    return response.json();
  },

  getRoomById: async (id: string): Promise<Room> => {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar sala');
    }
    return response.json();
  },
};

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: roomsApi.getRooms,
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomsApi.getRoomById(id),
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roomsApi.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export type { Room, CreateRoomData };
