import { TodoStatus } from 'src/graphql';

export interface ITodo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createDate: Date;
  userId: string;
}
