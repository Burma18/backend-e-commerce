import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '@src/modules/users/services/user.service';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.telegramId;

    if (!userId) {
      return false;
    }

    const user = await this.userService.findByTelegramId(userId);
    if (!user) {
      return false;
    }

    return user.role === UserRole.ADMIN;
  }
}
