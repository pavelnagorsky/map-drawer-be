import { 
  CanActivate, 
  ExecutionContext, 
  Injectable, 
  ForbiddenException, 
  BadRequestException 
} from "@nestjs/common";
import { Request } from "express";

import { FigureTypes } from "src/maps-module/dto/figure-types.enum";
import { MarkersService } from "src/maps-module/markers/markers.service";
import { RectanglesService } from "src/maps-module/rectangles/rectangles.service";

@Injectable()
export class IsAuthorGuard implements CanActivate {
  constructor(
    private readonly markersService: MarkersService,
    private readonly rectanglesService: RectanglesService
  ) {}

  // проверка, является ли текущий пользователь автором создаваемой фигуры
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId: number = request['userId'];
    const figureId: number = request.body['id'];
    const figureType: FigureTypes = request.body['figureType'];
  
    if (!figureType || !figureId) throw new BadRequestException();
    if (figureType === FigureTypes.MARKER) {
      const authorId = await this.markersService.getMarkerAuthorId(figureId);
      if (authorId !== userId) throw new ForbiddenException('Not author');
      return true;
    } else if (figureType === FigureTypes.RECTANGLE) {
      const authorId = await this.rectanglesService.getRectangleAuthorId(figureId);
      if (authorId !== userId) throw new ForbiddenException('Not author');
      return true;
    } else {
      throw new BadRequestException();
    }
  }
}