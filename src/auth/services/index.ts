import { UserService } from './user.service';
import { AuthService } from './auth.service';
export const services: (typeof UserService | typeof AuthService)[] = [
  UserService,
  AuthService,
];
