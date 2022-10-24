import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './config/database.module';
import { ValidationPipe } from './shared/pipes/validation.pipe';
import { UsersModule } from './users-module/users.module';
import { MapsModule } from './maps-module/maps-module';
import { SocketModule } from './gateway-module.ts/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule, 
    UsersModule,
    MapsModule,
    SocketModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
