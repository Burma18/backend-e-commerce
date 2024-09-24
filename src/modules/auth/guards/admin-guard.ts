import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtGuard } from './jwt-guard';

@Injectable()
export class AdminGuard extends JwtGuard implements CanActivate {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const userCanActivate = await super.canActivate(context);
    if (!userCanActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied. Admins only.');
    }

    return true;
  }
}
