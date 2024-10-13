import { Module } from '@nestjs/common';
import { UserService } from '@src/modules/users/services/user.service';
import { UserController } from '@src/modules/users/controllers/user.controller';
import { UserAdminController } from './controllers/user-admin.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [UserService],
  controllers: [UserController, UserAdminController],
  exports: [UserService],
})
export class UsersModule {}
