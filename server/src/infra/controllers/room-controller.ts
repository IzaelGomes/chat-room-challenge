import { Request, Response } from 'express';
import { validateSchema } from '../utils/validade-schema';
import { createRoomSchema } from '../schemas/room';
import { CreateRoomUseCase } from '../../app/usecases/create-room-usecase';
import { RoomRepository } from '../repositories/room-repository';

export class RoomController {
  async createRoom(req: Request, res: Response): Promise<void> {
    const { name } = validateSchema(createRoomSchema, req.body);
    const roomRepository = new RoomRepository();
    const createRoomUseCase = new CreateRoomUseCase(roomRepository);
    const result = await createRoomUseCase.execute({ name });

    res.status(201).json(result.room);
  }
}
