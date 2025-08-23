import bcrypt from 'bcryptjs';
import { UserRepositoryInterface } from '../repository/user-repository-interface';
import { AppError } from '../error/app-error';

interface SignUpRequest {
  username: string;
  password: string;
}

interface SignUpResponse {
  user: {
    id: string;
    username: string;
    createdAt: Date;
  };
}

export class SignUpUseCase {
  constructor(private userRepository: UserRepositoryInterface) {}

  async execute({
    username,
    password,
  }: SignUpRequest): Promise<SignUpResponse> {
    const existingUser = await this.userRepository.findUserByUsername(username);

    if (existingUser) {
      throw new AppError('Username já está em uso', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    };
  }
}
