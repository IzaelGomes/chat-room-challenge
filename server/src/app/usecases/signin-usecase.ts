import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepositoryInterface } from '../repository/user-repository-interface';
import { AppError } from '../error/app-error';
import { env } from '../../infra/config/env';

type SignInRequest = {
  username: string;
  password: string;
};

type SignInResponse = {
  user: {
    id: string;
    username: string;
  };
  token: string;
};

export class SignInUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({
    username,
    password,
  }: SignInRequest): Promise<SignInResponse> {
    const user = await this.userRepository.findUserByUsername(username);

    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    };
  }
}
