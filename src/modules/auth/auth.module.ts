import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { environment } from '@src/environment';
import { AuthController } from './controllers/auth.controller';
import { JwtGuard } from './guards/jwt-guard';
import { RolesGuard } from './guards/roles-guard';

@Global()
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: environment.jwtSecret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
