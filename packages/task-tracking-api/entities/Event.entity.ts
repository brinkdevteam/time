import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity()
  export default class Event {
    @PrimaryGeneratedColumn()
    id: number = -1;

    @Column({
      type: 'int',
    })
    type?: number = -1;

    @Column({
      nullable: true,
      type: 'int',
    })
    sourceId: number = -1;

    @Column({
        default: '',
        nullable: true,
        type: 'text',
    })
    data: string = '';
  }
