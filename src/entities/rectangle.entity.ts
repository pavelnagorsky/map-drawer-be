import { Entity, Column, PrimaryGeneratedColumn, Double, OneToOne, JoinColumn } from 'typeorm';

import { FigureInfo } from './figure-info.entity';

@Entity({ name: "rectangles" })
export class Rectangle {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FigureInfo, { cascade: true })
  @JoinColumn()
  info: FigureInfo;

  @Column({ type: 'double precision' })
  north: number;

  @Column({ type: 'double precision' })
  south: number;

  @Column({ type: 'double precision' })
  east: number;

  @Column({ type: 'double precision' })
  west: number;

  @Column()
  fillColor: string;

  @Column()
  strokeColor: string;

  @Column({ type: 'float' })
  fillOpacity: number
}