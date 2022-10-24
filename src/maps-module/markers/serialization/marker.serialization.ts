import { FigureSerialization } from "src/maps-module/serialization/figure.serialization";

export interface MarkerSerialization extends FigureSerialization {
  readonly position: {
    lat: number,
    lng: number
  };
  readonly url?: string;
}