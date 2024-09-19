import { Module } from '@nestjs/common';
import { UserService } from '@src/modules/users/services/user.service';
import { UserController } from '@src/modules/users/controllers/user.controller';

@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
