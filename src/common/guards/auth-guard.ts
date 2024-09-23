import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '@src/modules/users/services/user.service';
import { UserRole } from '@src/modules/users/enums/user-role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.telegramId;
    const userName = request.user.username;

    if (!userId) {
      return false;
    }

    let user = await this.userService.findByTelegramId(userId);
    if (!user) {
      user = await this.userService.create({
        telegramId: userId,
        username: userName,
        role: UserRole.USER,
      });
    }

    return true;
  }
}
