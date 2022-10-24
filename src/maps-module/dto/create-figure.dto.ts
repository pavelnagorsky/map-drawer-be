import { IsNumber, IsString, MinLength } from "class-validator";

export class CreateFigureDto {
  @IsNumber()
  readonly authorId: number;

  @IsString()
  @MinLength(1)
  readonly title: string;

  @IsString()
  @MinLength(1)
  readonly description: string;
}