import { Injectable } from '@nestjs/common';
import { UserRole } from '@src/modules/users/enums/user-role.enum';
import { UserService } from '@src/modules/users/services/user.service';
import { StartDto } from '../dto/start-app.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async start(startDto: StartDto) {
    const { telegramId, username } = startDto;

    const parsedTelegramId = telegramId.toString();

    let user = await this.userService.findByTelegramId(parsedTelegramId);

    if (!user) {
      user = await this.userService.create({
        telegramId: telegramId,
        username,
        role: UserRole.USER,
      });
    }

    return { role: user.role };
  }

  // async validateToken(token: string) {
  //   try {
  //     const decoded = this.jwtService.verify(token);
  //     const user = await this.userService.findOneBy({ id: decoded.id });
  //     return user;
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid or expired token');
  //   }
  // }

  // private generateToken(user: User): string {
  //   return this.jwtService.sign({ id: user.id, role: user.role });
  // }
}
