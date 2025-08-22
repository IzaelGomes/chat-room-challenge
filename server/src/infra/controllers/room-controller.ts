import { Request, Response } from 'express';
import { validateSchema } from '../utils/validade-schema';
import { createRoomSchema, getRoomByIdSchema } from '../schemas/room';
import { CreateRoomUseCase } from '../../app/usecases/create-room-usecase';
import { RoomRepository } from '../repositories/room-repository';
import { GetRoomsUseCase } from '../../app/usecases/get-rooms-usecase';
import { GetRoomByIdUseCase } from '../../app/usecases/get-room-by-id-usecase';

export class RoomController {
  async createRoom(req: Request, res: Response): Promise<void> {
    const { name } = validateSchema(createRoomSchema, req.body);
    const roomRepository = new RoomRepository();
    const createRoomUseCase = new CreateRoomUseCase(roomRepository);
    const result = await createRoomUseCase.execute({ name });

    res.status(201).json(result.room);
  }

  async getRooms(req: Request, res: Response): Promise<void> {
    const roomRepository = new RoomRepository();
    const getRoomsUseCase = new GetRoomsUseCase(roomRepository);
    const result = await getRoomsUseCase.execute();
    res.json(result.rooms);
  }

  async getRoomById(req: Request, res: Response): Promise<void> {
    const { id } = validateSchema(getRoomByIdSchema, req.params);
    const roomRepository = new RoomRepository();
    const getRoomByIdUseCase = new GetRoomByIdUseCase(roomRepository);

    const result = await getRoomByIdUseCase.execute({ id });

    res.json(result.room);
  }
}
