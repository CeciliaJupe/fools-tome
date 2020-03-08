import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class CardSet {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  setCode: string;

  @Column()
  setType: string;
}
