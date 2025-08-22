import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
});

export const getRoomByIdSchema = z.object({
  id: z.uuid(),
});
