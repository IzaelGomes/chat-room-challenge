import {
  RoomRepositoryInterface,
  Room,
} from '../repository/room-repository-interface';

export interface GetRoomsResponse {
  rooms: Room[];
}

export class GetRoomsUseCase {
  constructor(private roomRepository: RoomRepositoryInterface) {}

  async execute(): Promise<GetRoomsResponse> {
    const rooms = await this.roomRepository.getRooms();

    return {
      rooms,
    };
  }
}
