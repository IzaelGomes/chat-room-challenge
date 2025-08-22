import { AppError } from '../error/app-error';
import {
  RoomRepositoryInterface,
  Room,
} from '../repository/room-repository-interface';

export interface CreateRoomRequest {
  name: string;
}

export interface CreateRoomResponse {
  room: Room;
}

export class CreateRoomUseCase {
  constructor(private roomRepository: RoomRepositoryInterface) {}

  async execute(request: CreateRoomRequest): Promise<CreateRoomResponse> {
    const { name } = request;

    const roomWithSameName = await this.roomRepository.findRoomByName(name);

    if (roomWithSameName) {
      throw new AppError('Room with same name already exists', 400);
    }

    const room = await this.roomRepository.createRoom({
      name: name,
      createdAt: new Date(),
    });

    return {
      room,
    };
  }
}
