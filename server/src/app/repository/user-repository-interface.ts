export type UserCreateData = {
  username: string;
  password: string;
  createdAt: Date;
};

export type User = {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface UserRepositoryInterface {
  createUser(data: UserCreateData): Promise<User>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
}
