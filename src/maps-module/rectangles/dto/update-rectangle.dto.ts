import { IsNumber } from "class-validator";

export class UpdateRectangleDto {
  @IsNumber()
  readonly authorId: number;

  @IsNumber()
  readonly south: number;

  @IsNumber()
  readonly north: number;

  @IsNumber()
  readonly east: number;

  @IsNumber()
  readonly west: number;
}