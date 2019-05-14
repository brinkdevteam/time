import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class EventType {
  @PrimaryGeneratedColumn()
  id: number = -1;

  @Column({
    type: 'varchar',
  })
  name?: string = "";
}
