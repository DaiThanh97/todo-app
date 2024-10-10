export interface ITodoListQueryResponse {
  todos: ITodoListQueryResult;
}

export interface ITodoQueryResponse {
  todo: Todo;
}

export interface ITodoListQueryResult {
  result: Todo[];
  totalCount: number;
}

export interface ITodoListVars {
  filter: {
    status?: TodoStatus;
  };
}

export interface ICreateTodoInput {
  title: string;
  description?: string;
  status: TodoStatus;
}

export interface ICreateTodoVars {
  input: ICreateTodoInput;
}

export interface IUpdateTodoVars {
  id: string;
  input: ICreateTodoInput;
}

export interface ICreateTodoResult {
  createTodo: Todo;
}

export interface IUpdateTodoResult {
  updateTodo: Todo;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum TodoStatus {
  READY = "READY",
  BLOCKED = "BLOCKED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
