import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(public access: IAccess | string[] | string) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.access) {
      return true;
    }
    // tslint:disable-next-line:no-any
    const req: any = context.switchToHttp().getRequest();
    const { user, query } = req;
    const role: string = user.role;

    let hasPermission: boolean = false;

    if (typeof this.access === 'string') {
      if (this.access !== role) {
        throw new HttpException('Permission denied.', HttpStatus.FORBIDDEN);
      }
      return true;
    }
    if (Array.isArray(this.access)) {
      if (!this.access.includes(role)) {
        throw new HttpException('Permission denied.', HttpStatus.FORBIDDEN);
      }
      return true;
    }
    for (const accessRole in this.access) {
      if (role === accessRole) {
        hasPermission = true;
        const userQuery: string[] = query ? Object.keys(query) : [];
        const permission: string[] = this.access[accessRole];
        userQuery.forEach((itemQuery: string) => {
          if (!permission.includes(itemQuery) && permission.length > 0) {
            hasPermission = false;
          }
        });
      }
    }

    if (!hasPermission) {
      throw new HttpException('Permission denied.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}

export interface IAccess {
  [key: string]: string[];
}
