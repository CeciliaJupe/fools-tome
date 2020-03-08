import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;
}