import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    scryfallID: string

    @Column()
    cardName: string;

    @Column()
    setName: string;

    @Column()
    collectorNumber: string;

    @Column()
    colors: string[];

    @Column()
    cardType: string;

    @Column()
    qtyOwned: number;

    @Column()
    qtyNeeded: number;

    @Column()
    qtyTrade: number;
}