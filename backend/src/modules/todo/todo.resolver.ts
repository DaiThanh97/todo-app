import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { ICurrentUser } from '../user/user.interface';
import { CreateTodoDto, TodoFilterDto, UpdateTodoDto } from './todo.dto';
import { TodoService } from './todo.service';
import { Todo, TodosResult } from 'src/graphql';

@Resolver('Todo')
@UseGuards(JwtGuard)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query('todos')
  todos(
    @Args('filter') filter: TodoFilterDto,
    @Args('limit') limit: number,
    @Args('skip') skip: number,
    @CurrentUser() user: ICurrentUser,
  ): Promise<TodosResult> {
    return this.todoService.todos(filter, limit, skip, user.sub);
  }

  @Query('todo')
  todo(
    @Args('id') todoId: string,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Todo> {
    return this.todoService.todo(todoId, user.sub);
  }

  @Mutation('createTodo')
  createTodo(
    @Args('input') createTodoDto: CreateTodoDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<Todo> {
    return this.todoService.createTodo(createTodoDto, user.sub);
  }

  @Mutation('updateTodo')
  updateTodo(
    @Args('id') todoId: string,
    @Args('input') updateTodoDto: UpdateTodoDto,
    @CurrentUser() user: ICurrentUser,
  ): Promise<boolean> {
    return this.todoService.updateTodo(todoId, updateTodoDto, user.sub);
  }
}
