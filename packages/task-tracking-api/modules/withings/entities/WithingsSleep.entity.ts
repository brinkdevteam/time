import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class WithingsSleep {
  @PrimaryGeneratedColumn()
  id: number = -1;

  @Column({
    type: 'varchar',
  })
  name?: string = "";

  @Column({
    type: 'int',
  })
  taskId?: number = 0;
}
