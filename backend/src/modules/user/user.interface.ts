import { ITodo } from '../todo/todo.interface';

export interface ICurrentUser {
  sub: string;
  email: string;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  createDate: Date;
  todos: ITodo[];
}
