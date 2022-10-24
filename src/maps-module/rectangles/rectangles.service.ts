import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FigureInfo } from "src/entities/figure-info.entity";
import { UsersService } from "src/users-module/users-service/users.service";
import { Rectangle } from "src/entities/rectangle.entity";
import { RectangleSerialization } from "./serialization/rectangle.serialization";
import { CreateRectangleDto } from "./dto/create-rectangle.dto";
import { UpdateRectangleDto } from "./dto/update-rectangle.dto";

@Injectable()
export class RectanglesService {
  constructor(
    @InjectRepository(Rectangle)
    private readonly rectangleRepository: Repository<Rectangle>,
    @InjectRepository(FigureInfo)
    private readonly figureInfoRepository: Repository<FigureInfo>,
    private readonly usersService: UsersService
  ) {}

  // получить id автора прямоугольника
  async getRectangleAuthorId(rectangleId: number) {
    const rectangle = await this.rectangleRepository.findOne({
      relations: {
        info: {
          author: true
        }
      },
      where: {
        id: rectangleId
      },
      select: {
        id: true
      }
    });
    return rectangle?.info?.author.id
  }

  // получить все прямоугольники
  async getRectangles(): Promise<RectangleSerialization[]> 
  {
    const rectangles = await this.rectangleRepository.find({
      relations: {
        info: {
          author: true
        }
      }
    });
    const serializedRectangles = rectangles.map((rect): RectangleSerialization => {
      return this.seriaizeRectangle(rect)
    });
    return serializedRectangles
  }

  // создать прямоугольник
  async createRectangle(rectangleData: CreateRectangleDto): Promise<RectangleSerialization> {
    const author = await this.usersService.findOne(rectangleData.authorId);
    if (!author) throw new NotFoundException('No user found');
    const figureInfo = this.figureInfoRepository.create({
      author: author,
      title: rectangleData.title,
      description: rectangleData.description
    });
    const figureInfoRow = await this.figureInfoRepository.save(figureInfo);
    const rectangle = this.rectangleRepository.create({
      info: figureInfoRow,
      south: rectangleData.south,
      north: rectangleData.north,
      east: rectangleData.east,
      west: rectangleData.west,
      fillColor: rectangleData.fillColor,
      fillOpacity: rectangleData.fillOpacity,
      strokeColor: rectangleData.strokeColor
    });
    const rectangleRow = await this.rectangleRepository.save(rectangle);
    return {
      id: rectangleRow.id,
      title: figureInfoRow.title,
      description: figureInfoRow.description,
      createdAt: figureInfoRow.createdAt,
      bounds: {
        north: rectangleRow.north,
        south: rectangleRow.south,
        east: rectangleRow.east,
        west: rectangleRow.west
      },
      options: {
        fillColor: rectangleRow.fillColor,
        fillOpacity: rectangleRow.fillOpacity,
        strokeColor: rectangleRow.strokeColor
      },
      author: {
        id: author.id,
        username: author.username
      }
    } 
  }

  // удалить прямоугольник и информацию о нем
  async deleteRectangle(id: number): Promise<number> {
    const deletedRectangle = await this.rectangleRepository.findOne({
      relations: {
        info: true
      },
      where: { id: id },
      select: { id: true }
    });
    if (!deletedRectangle) throw new NotFoundException('Rectangle not found');
    await this.rectangleRepository.delete(id);
    await this.figureInfoRepository.delete(deletedRectangle.info.id);
    return id;
  }

  // обновить прямоугольник
  async updateRectangle(id: number, rectangleData: UpdateRectangleDto) {
    const rectangle = await this.rectangleRepository.findOne({
      where: {
        id: id
      },
      relations: {
        info: {
          author: true
        }
      }
    });
    if (!rectangle) throw new NotFoundException('Rectangle not found');
    rectangle.east = rectangleData.east;
    rectangle.west = rectangleData.west;
    rectangle.north = rectangleData.north;
    rectangle.south = rectangleData.south;
    const updatedRectangle = await this.rectangleRepository.save(rectangle);
    return this.seriaizeRectangle(updatedRectangle);
  }

  private seriaizeRectangle(rect: Rectangle): RectangleSerialization {
    return {
      id: rect.id,
      title: rect.info.title,
      description: rect.info.description,
      createdAt: rect.info.createdAt,
      author: {
        id: rect.info.author.id,
        username: rect.info.author.username
      },
      bounds: {
        north: rect.north,
        south: rect.south,
        west: rect.west,
        east: rect.east
      },
      options: {
        fillColor: rect.fillColor,
        fillOpacity: rect.fillOpacity,
        strokeColor: rect.strokeColor
      }
    }
  }

}