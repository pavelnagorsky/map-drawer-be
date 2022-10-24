export interface FigureSerialization {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly author: {
    id: number,
    username: string
  };
}