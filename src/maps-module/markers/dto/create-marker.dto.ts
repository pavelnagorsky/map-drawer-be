import { IsNumber, IsUrl, ValidateIf } from "class-validator";
import { CreateFigureDto } from "src/maps-module/dto/create-figure.dto";

export class CreateMarkerDto extends CreateFigureDto {
  @ValidateIf((o: CreateMarkerDto) => typeof o.url === 'string')
  @IsUrl()
  readonly url?: string;

  @IsNumber()
  readonly lat: number;

  @IsNumber()
  readonly lng: number;
}