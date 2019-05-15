import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class EventSourceProvideType {
  @PrimaryGeneratedColumn()
  id: number = -1;

  @Column({
    nullable: true,
    type: 'int',
  })
  sourceId: number = -1;

  @Column({
    nullable: true,
    type: 'int',
  })
  eventTypeId: number = -1;
}
