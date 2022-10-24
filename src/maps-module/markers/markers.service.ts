import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FigureInfo } from "src/entities/figure-info.entity";
import { Marker } from "src/entities/marker.entity";
import { CreateMarkerDto } from "./dto/create-marker.dto";
import { UsersService } from "src/users-module/users-service/users.service";
import { MarkerSerialization } from "./serialization/marker.serialization";

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private readonly markerRepository: Repository<Marker>,
    @InjectRepository(FigureInfo)
    private readonly figureInfoRepository: Repository<FigureInfo>,
    private readonly usersService: UsersService
  ) {}

  // получить id автора маркера
  async getMarkerAuthorId(markerId: number) {
    const marker = await this.markerRepository.findOne({
      relations: {
        info: {
          author: true
        }
      },
      where: {
        id: markerId
      },
      select: {
        id: true
      }
    });
    return marker?.info?.author.id
  }

  // получить все маркеры
  async getMarkers(): Promise<MarkerSerialization[]> 
  {
    const markers = await this.markerRepository.find({
      relations: {
        info: {
          author: true
        }
      }
    });
    const serializedMarkers = markers.map((marker): MarkerSerialization => {
      return {
        id: marker.id,
        title: marker.info.title,
        description: marker.info.description,
        createdAt: marker.info.createdAt,
        author: {
          id: marker.info.author.id,
          username: marker.info.author.username
        },
        url: marker.url,
        position: {
          lat: marker.lat,
          lng: marker.lng
        }
      }
    });
    return serializedMarkers
  }

  // создать маркер
  async createMarker(markerData: CreateMarkerDto): Promise<MarkerSerialization> {
    const author = await this.usersService.findOne(markerData.authorId);
    if (!author) throw new NotFoundException('No user found');
    const figureInfo = this.figureInfoRepository.create({
      author: author,
      title: markerData.title,
      description: markerData.description
    });
    const figureInfoRow = await this.figureInfoRepository.save(figureInfo);
    const marker = this.markerRepository.create({
      info: figureInfoRow,
      lat: markerData.lat,
      lng: markerData.lng,
      url: markerData.url
    });
    const markerRow = await this.markerRepository.save(marker);
    return {
      id: markerRow.id,
      title: figureInfoRow.title,
      description: figureInfoRow.description,
      createdAt: figureInfoRow.createdAt,
      position: {
        lat: markerRow.lat,
        lng: markerRow.lng
      },
      url: markerRow.url,
      author: {
        id: author.id,
        username: author.username
      }
    }
  }

  // удалить маркер и информацию о нем
  async deleteMarker(id: number): Promise<number> {
    const deletedMarker = await this.markerRepository.findOne({
      relations: {
        info: true
      },
      where: { id: id },
      select: { id: true }
    });
    if (!deletedMarker) throw new NotFoundException('Marker not found');
    await this.markerRepository.delete(id);
    await this.figureInfoRepository.delete(deletedMarker.info.id);
    return id;
  }

}