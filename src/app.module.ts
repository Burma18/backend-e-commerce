import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from '@src/config/typeorm.config';
import { UsersModule } from '@src/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeORMConfig,
    }),
    UsersModule,
  ],
})
export class AppModule {}
