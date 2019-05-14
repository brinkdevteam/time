import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity()
  export default class EventSource {
    @PrimaryGeneratedColumn()
    id: number = -1;

    @Column({
      nullable: true,
      type: 'varchar',
      unique: true,
    })
    name: string = "";

    @Column({
      nullable: true,
      type: 'varchar',
    })
    authToken: string = "";

    @Column({
      nullable: true,
      type: 'varchar',
    })
    refreshToken: string = "";

    @Column({
      nullable: true,
      type: 'int',
    })
    userId: number = -1;
  }
