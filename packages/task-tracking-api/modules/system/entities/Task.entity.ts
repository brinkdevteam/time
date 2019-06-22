import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Task {
  @PrimaryGeneratedColumn()
  id: number = -1;

  @Column({
    type: 'int',
  })
  type?: number = 0;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  name?: string = "";

  @Column({
    type: 'int',
  })
  startDate?: number = 0;

  @Column({
    type: 'int',
  })
  endDate?: number = 0;

  @Column({
    nullable: true,
    type: 'int',
  })
  goalId?: number = 0;

  @Column({
    nullable: true,
    type: 'int',
  })
  projectId?: number = 0;

  @Column({
    nullable: true,
    type: 'int',
  })
  valueId?: number = 0;
}
