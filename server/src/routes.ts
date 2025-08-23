import { Router } from 'express';
import { RoomController } from './infra/controllers/room-controller';
import { AuthController } from './infra/controllers/auth-controller';
import { authMiddleware } from './infra/middlewares/auth-middleware';

export const router = Router();

const roomController = new RoomController();
const authController = new AuthController();

router.post('/auth/signup', authController.signUp);
router.post('/auth/signin', authController.signIn);
router.post('/auth/signout', authController.signOut);
router.get('/auth/me', authMiddleware, authController.me);

router.post('/rooms', authMiddleware, roomController.createRoom);
router.get('/rooms', authMiddleware, roomController.getRooms);
router.get('/rooms/:id', authMiddleware, roomController.getRoomById);
