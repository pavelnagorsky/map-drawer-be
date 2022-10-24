import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FigureInfo } from 'src/entities/figure-info.entity';
import { Marker } from 'src/entities/marker.entity';
import { Rectangle } from 'src/entities/rectangle.entity';
import { UsersModule } from 'src/users-module/users.module';
import { MarkersController } from './markers/markers.controller';
import { MarkersService } from './markers/markers.service';
import { RectanglesController } from './rectangles/rectangles.controller';
import { RectanglesService } from './rectangles/rectangles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FigureInfo,
      Marker,
      Rectangle
    ]), 
    UsersModule
  ],
  providers: [
    MarkersService,
    RectanglesService
  ],
  controllers: [
    MarkersController,
    RectanglesController
  ]
})
export class MapsModule {}