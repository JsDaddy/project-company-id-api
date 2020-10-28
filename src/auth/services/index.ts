import { VacationsService } from './../../vacations/services/vacations.service';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
export const services: (
  | typeof UserService
  | typeof AuthService
  | typeof VacationsService
)[] = [UserService, AuthService, VacationsService];
