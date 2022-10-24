import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.BD_USER ?? 'root',
      password: process.env.BD_PW ?? 'root',
      database: 'maps-app',
      // entities: [
      //   User
      // ],
      autoLoadEntities: true,
      synchronize: true
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}