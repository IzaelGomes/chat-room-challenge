import { Router } from 'express';
import { RoomController } from './infra/controllers/room-controller';

export const router = Router();

const roomController = new RoomController();

router.post('/rooms', roomController.createRoom);
router.get('/rooms', roomController.getRooms);
router.get('/rooms/:id', roomController.getRoomById);
