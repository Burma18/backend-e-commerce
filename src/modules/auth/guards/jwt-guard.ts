import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['session'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const user = await this.authService.validateToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    request.user = user;
    return true;
  }
}
