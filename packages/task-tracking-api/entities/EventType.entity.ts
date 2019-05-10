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
    type: 'varchar',
  })
  name?: string = "";
}
