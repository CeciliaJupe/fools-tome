import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn } from 'typeorm';
import { CardSet } from './cardSet.entity';
import { CardCount } from './cardCount.entity';

@Entity()
export class Card {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @JoinColumn()
    setName: CardSet;

    @Column({nullable: true})
    collectorNumber: string;

    @Column({type: 'simple-array', nullable: true})
    colors: string[];

    @Column({nullable: true})
    cardType: string;

    @OneToMany(type => CardCount, cardCount => cardCount.card)
    cardCounts: CardCount[];
}
