import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";

import { SocketMessages } from "src/gateway-module.ts/socket-messages.enum";
import { SocketService } from "src/gateway-module.ts/socket.service";
import { HttpAuthGuard } from "src/services/guards/http-auth.guard";
import { IsAuthorGuard } from "src/services/guards/is-author.guard";
import { CreateMarkerDto } from "./dto/create-marker.dto";
import { MarkersService } from "./markers.service";

@Controller('map/markers')
export class MarkersController {
  constructor(
    private readonly markersService: MarkersService,
    private readonly socketService: SocketService
  ) {}

  @Get()
  async getAll() {
    const markers = await this.markersService.getMarkers();
    return {
      message: 'Markers successfully fetched',
      markers: markers
    }
  }

  @Post()
  @UseGuards(HttpAuthGuard)
  async addMarker(@Body() markerDto: CreateMarkerDto) {
    const serializedMarker = await this.markersService.createMarker(markerDto);
    this.socketService.socket.emit(SocketMessages.NEW_MARKER, {
      marker: serializedMarker
    })
    return {
      message: 'New marker added',
      marker: serializedMarker
    };
  }

  @Delete(':id')
  @UseGuards(HttpAuthGuard, IsAuthorGuard)
  async deleteRectangle(
    @Param('id', ParseIntPipe) id: number
  ) {
    const deletedId = await this.markersService.deleteMarker(id);
    this.socketService.socket.emit(SocketMessages.DELETE_MARKER, {
      id: deletedId
    })
    return {
      message: 'Marker succesfully deleted',
      id: deletedId
    }
  }
}