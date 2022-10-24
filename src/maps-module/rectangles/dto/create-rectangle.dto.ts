import { IsNumber, IsString, Max, Min } from "class-validator";
import { CreateFigureDto } from "src/maps-module/dto/create-figure.dto";

export class CreateRectangleDto extends CreateFigureDto {
  @IsNumber()
  readonly south: number;

  @IsNumber()
  readonly north: number;

  @IsNumber()
  readonly east: number;

  @IsNumber()
  readonly west: number;

  @IsString()
  readonly fillColor: string;

  @IsString()
  readonly strokeColor: string;

  @IsNumber()
  @Max(1)
  @Min(0)
  readonly fillOpacity: number;
}