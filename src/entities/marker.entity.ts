import { Entity, Column, PrimaryGeneratedColumn, Double, OneToOne, JoinColumn } from 'typeorm';

import { FigureInfo } from './figure-info.entity';

@Entity({ name: "markers" })
export class Marker {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FigureInfo, { cascade: true })
  @JoinColumn()
  info: FigureInfo;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ nullable: true })
  url?: string 
}