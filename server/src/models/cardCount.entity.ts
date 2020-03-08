import { Entity, Column, PrimaryColumn, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Card } from '../cards/card.entity';

@Entity()
export class CardCount {
  @PrimaryColumn('uuid')
  id: string;

  @JoinColumn()
  user: User;

  @ManyToOne(type => Card, card => card.cardCounts)
  card: Card;

  @Column({nullable: true})
  qtyOwned: number;

  @Column({nullable: true})
  qtyNeeded: number;

  @Column({nullable: true})
  qtyTrade: number;
}
