import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number = -1;

  @Column({
    type: 'varchar',
  })
  name?: string = "";
}
