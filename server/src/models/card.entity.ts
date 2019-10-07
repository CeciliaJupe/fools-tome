import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Card {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable: true})
    setName: string;

    @Column({nullable: true})
    collectorNumber: string;

    @Column({type: 'simple-array', nullable: true})
    colors: string[];

    @Column({nullable: true})
    cardType: string;

    @Column({nullable: true})
    qtyOwned: number;

    @Column({nullable: true})
    qtyNeeded: number;

    @Column({nullable: true})
    qtyTrade: number;


}
