import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user-repository';
import { env } from '../config/env';
import { AppError } from '../../app/error/app-error';

interface JwtPayload {
  userId: string;
  username: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies['auth-token'];

    if (!token) {
      throw new AppError('Token de acesso não fornecido', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findUserById(decoded.userId);

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    req.user = {
      id: user.id,
      username: user.username,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Token inválido', 401);
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expirado', 401);
    }
    throw error;
  }
};
