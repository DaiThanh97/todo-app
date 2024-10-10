
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TodoStatus {
    READY = "READY",
    BLOCKED = "BLOCKED",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}

export class SignUpInput {
    email: string;
    password: string;
}

export class LoginInput {
    email: string;
    password: string;
}

export class TodoFilterInput {
    status?: Nullable<TodoStatus>;
}

export class CreateTodoInput {
    title: string;
    description?: Nullable<string>;
    status?: Nullable<TodoStatus>;
}

export abstract class IQuery {
    abstract userByToken(token: string): Nullable<User> | Promise<Nullable<User>>;

    abstract todos(filter?: Nullable<TodoFilterInput>, limit?: Nullable<number>, skip?: Nullable<number>): Nullable<TodosResult> | Promise<Nullable<TodosResult>>;

    abstract todo(id: string): Nullable<Todo> | Promise<Nullable<Todo>>;
}

export abstract class IMutation {
    abstract logIn(input: LoginInput): LoginResponse | Promise<LoginResponse>;

    abstract signUp(input: SignUpInput): boolean | Promise<boolean>;

    abstract createTodo(input: CreateTodoInput): Todo | Promise<Todo>;

    abstract updateTodo(id: string, input: CreateTodoInput): boolean | Promise<boolean>;
}

export class LoginResponse {
    id: string;
    email: string;
    accessToken: string;
}

export class Todo {
    id: string;
    title: string;
    description?: Nullable<string>;
    status: TodoStatus;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export class TodosResult {
    result?: Nullable<Nullable<Todo>[]>;
    totalCount?: Nullable<number>;
}

export class User {
    id: string;
    email: string;
}

export type DateTime = any;
type Nullable<T> = T | null;
