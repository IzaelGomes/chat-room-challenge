import { prisma } from '../config/prisma';
import {
  UserRepositoryInterface,
  UserCreateData,
  User,
} from '../../app/repository/user-repository-interface';

export class UserRepository implements UserRepositoryInterface {
  async createUser(data: UserCreateData): Promise<User> {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        createdAt: data.createdAt,
      },
    });

    return user;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
