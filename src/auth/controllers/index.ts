import { AuthController } from './auth.controller';
import { UserController } from './user.controller';
export const controllers: (typeof AuthController | typeof UserController)[] = [
  AuthController,
  UserController,
];
