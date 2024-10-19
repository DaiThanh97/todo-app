// import { TodoStatus } from 'src/graphql';
// import {
//   Column,
//   Entity,
//   CreateDateColumn,
//   Index,
//   PrimaryGeneratedColumn,
//   ManyToOne,
// } from 'typeorm';
// import { UserEntity } from '../user/user.entity';

// @Entity({ name: 'todos' })
// export class TodoEntity {
//   @PrimaryGeneratedColumn('uuid')
//   @Index('IDX_ID')
//   id!: string;

//   @Column()
//   title!: string;

//   @Column()
//   description?: string;

//   @Column({
//     type: 'enum',
//     enum: TodoStatus,
//     default: TodoStatus.READY,
//   })
//   status!: TodoStatus;

//   @CreateDateColumn()
//   createDate!: Date;

//   @ManyToOne(() => UserEntity, (user) => user.todos, { onDelete: 'SET NULL' })
//   user!: UserEntity;
// }
