import { 
  Body, Controller, Delete,
  Get, Param, ParseIntPipe, 
  Patch, Post, UseGuards 
} from "@nestjs/common";

import { SocketMessages } from "src/gateway-module.ts/socket-messages.enum";
import { SocketService } from "src/gateway-module.ts/socket.service";
import { HttpAuthGuard } from "src/services/guards/http-auth.guard";
import { IsAuthorGuard } from "src/services/guards/is-author.guard";
import { CreateRectangleDto } from "./dto/create-rectangle.dto";
import { UpdateRectangleDto } from "./dto/update-rectangle.dto";
import { RectanglesService } from "./rectangles.service";

@Controller('map/rectangles')
export class RectanglesController {
  constructor(
    private readonly rectanglesService: RectanglesService,
    private readonly socketService: SocketService
  ) {}

  @Get()
  async getAll() {
    const rectangles = await this.rectanglesService.getRectangles();
    return {
      message: 'Rectangles successfully fetched',
      rectangles: rectangles
    }
  }

  @Post()
  @UseGuards(HttpAuthGuard)
  async addRectangle(@Body() rectangleDto: CreateRectangleDto) {
    const serializedRectangle = await this.rectanglesService.createRectangle(rectangleDto);
    this.socketService.socket.emit(SocketMessages.NEW_RECTANGLE, {
      rectangle: serializedRectangle
    })
    return {
      message: 'New rectangle added',
      rectangle: serializedRectangle
    }
  }

  @Patch(':id')
  @UseGuards(HttpAuthGuard, IsAuthorGuard)
  async updateRectangle(
    @Param('id', ParseIntPipe) id: number,
    @Body() rectangleDto: UpdateRectangleDto
  ) {
    const serializedRectangle = await this.rectanglesService.updateRectangle(id, rectangleDto);
    this.socketService.socket.emit(SocketMessages.UPDATE_RECTANGLE, {
      rectangle: serializedRectangle
    })
    return {
      message: 'Rectangle succesfully updated',
      rectangle: serializedRectangle
    }
  }

  @Delete(':id')
  @UseGuards(HttpAuthGuard, IsAuthorGuard)
  async deleteRectangle(
    @Param('id', ParseIntPipe) id: number
  ) {
    const deletedId = await this.rectanglesService.deleteRectangle(id);
    this.socketService.socket.emit(SocketMessages.DELETE_RECTANGLE, {
      id: deletedId
    })
    return {
      message: 'Rectangle succesfully deleted',
      id: deletedId
    }
  }
}