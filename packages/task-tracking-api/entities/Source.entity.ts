import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity()
  export default class Source {
    @PrimaryGeneratedColumn()
    id: number = -1;

    @Column({
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
      type: 'varchar',
    })
    tokenExpireTimestamp: string = "";

    @Column({
      nullable: true,
      type: 'int',
    })
    userId: number = -1;
  }
