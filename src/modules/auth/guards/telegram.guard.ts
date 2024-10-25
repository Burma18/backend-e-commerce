import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import { IRequestWithUser } from '@src/common/interaces/request-with-user.interface';
import { UserService } from '@src/modules/users/services/user.service';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(private readonly usersService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestWithUser>();
    const { telegramId } = request.params;

    if (!telegramId) {
      throw new ForbiddenException('Telegram ID not provided');
    }

    const user = await this.usersService.findByTelegramId(telegramId);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const jwtPayload: IJwtPayload = {
      id: user.id,
      role: user.role,
    };

    request.user = jwtPayload;

    return true;
  }
}
