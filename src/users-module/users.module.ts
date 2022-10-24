import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from 'src/users-module/auth-service/auth.service';
import { UsersService } from 'src/users-module/users-service/users.service';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  exports: [UsersService, AuthService]
})
export class UsersModule {}