import {
  Column,
  Entity,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { TodoEntity } from '../todo/todo.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index('IDX_ID')
  id!: string;

  @Column({ unique: true })
  @Index('IDX_EMAIL')
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createDate!: Date;

  @OneToMany(() => TodoEntity, (job) => job.user)
  todos!: TodoEntity[];
}
