import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { RolesGuard } from './guards/roles-guard';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
