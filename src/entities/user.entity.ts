import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FigureInfo } from './figure-info.entity';

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => FigureInfo, (figureInfo) => figureInfo.author)
  figures: FigureInfo[]
}