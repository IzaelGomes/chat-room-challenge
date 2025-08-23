import { Request, Response } from 'express';
import { validateSchema } from '../utils/validade-schema';
import { signUpSchema, signInSchema } from '../schemas/auth';
import { SignUpUseCase } from '../../app/usecases/signup-usecase';
import { SignInUseCase } from '../../app/usecases/signin-usecase';
import { UserRepository } from '../repositories/user-repository';

export class AuthController {
  async signUp(req: Request, res: Response): Promise<void> {
    const { username, password } = validateSchema(signUpSchema, req.body);

    const userRepository = new UserRepository();
    const signUpUseCase = new SignUpUseCase(userRepository);

    const result = await signUpUseCase.execute({ username, password });

    res.status(201).json(result);
  }

  async signIn(req: Request, res: Response): Promise<void> {
    const { username, password } = validateSchema(signInSchema, req.body);

    const userRepository = new UserRepository();
    const signInUseCase = new SignInUseCase(userRepository);

    const result = await signInUseCase.execute({ username, password });

    res.cookie('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      user: result.user,
      message: 'Login realizado com sucesso',
    });
  }

  async signOut(req: Request, res: Response): Promise<void> {
    res.clearCookie('auth-token');
    res.json({ message: 'Logout realizado com sucesso' });
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = (req as any).user;
    res.json({ user });
  }
}
