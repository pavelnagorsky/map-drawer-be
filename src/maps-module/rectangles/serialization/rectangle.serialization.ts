import { FigureSerialization } from "src/maps-module/serialization/figure.serialization";

export interface RectangleSerialization extends FigureSerialization {
  readonly bounds: {
    north: number,
    south: number,
    east: number,
    west: number
  };
  readonly options: {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
  };
}