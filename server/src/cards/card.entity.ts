import { Entity, Column, PrimaryColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { CardSet } from '../models/cardSet.entity';
import { CardCount } from '../models/cardCount.entity';

@Entity()
export class Card {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToOne(type => CardSet)
    @JoinColumn()
    cardSet: CardSet;

    @Column({nullable: true})
    collectorNumber: string;

    @Column({type: 'simple-array', nullable: true})
    colors: string[];

    @Column({nullable: true})
    cardType: string;

    @OneToMany(type => CardCount, cardCount => cardCount.card)
    cardCounts: CardCount[];
}
