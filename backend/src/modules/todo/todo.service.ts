import { Injectable } from '@nestjs/common';
import { TODO_NOT_FOUND, TODO_NOT_OWNED, TodoError } from './todo.error';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto, TodoFilterDto, UpdateTodoDto } from './todo.dto';
import { Todo, TodosResult } from 'src/graphql';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoRepository)
    private readonly todoRepository: TodoRepository,
  ) {}

  async todos(
    filter: TodoFilterDto,
    limit: number,
    skip: number,
    userId: string,
  ): Promise<TodosResult> {
    try {
      const [allTodos, countAllTodos] = await Promise.all([
        this.todoRepository.getAllTodo(filter, limit, skip, userId),
        this.todoRepository.countAllTodos(userId),
      ]);

      return {
        result: allTodos,
        totalCount: countAllTodos,
      };
    } catch (err) {
      throw new TodoError(err);
    }
  }

  async todo(todoId: string, userId: string): Promise<Todo> {
    try {
      const todo = await this.todoRepository.getTodoById(todoId);
      if (!todo) {
        throw new TodoError(TODO_NOT_FOUND);
      }

      if (todo.user.id !== userId) {
        throw new TodoError(TODO_NOT_OWNED);
      }

      return todo;
    } catch (err) {
      throw new TodoError(err);
    }
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    userId: string,
  ): Promise<Todo> {
    try {
      return this.todoRepository.createTodo(createTodoDto, userId);
    } catch (err) {
      throw new TodoError(err);
    }
  }

  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<boolean> {
    try {
      // Check todo available
      await this.todo(id, userId);
      return this.todoRepository.updateTodo(id, updateTodoDto);
    } catch (err) {
      throw new TodoError(err);
    }
  }
}
