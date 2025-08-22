import {
  RoomRepositoryInterface,
  Room,
} from '../repository/room-repository-interface';
import { AppError } from '../error/app-error';

export interface GetRoomByIdRequest {
  id: string;
}

export interface GetRoomByIdResponse {
  room: Room;
}

export class GetRoomByIdUseCase {
  constructor(private roomRepository: RoomRepositoryInterface) {}

  async execute(request: GetRoomByIdRequest): Promise<GetRoomByIdResponse> {
    const { id } = request;

    const room = await this.roomRepository.getRoomById(id);

    if (!room) {
      throw new AppError('Sala não encontrada', 404);
    }

    return {
      room,
    };
  }
}
