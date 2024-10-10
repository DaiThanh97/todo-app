import { EntityRepository, Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto, TodoFilterDto } from './todo.dto';

@EntityRepository(TodoEntity)
export class TodoRepository extends Repository<TodoEntity> {
  async createTodo(input: CreateTodoDto, userId: string): Promise<TodoEntity> {
    const todo = this.create({
      ...input,
      user: { id: userId },
    });
    await this.save(todo);
    return todo;
  }

  async updateTodo(todoId: string, input: CreateTodoDto): Promise<boolean> {
    const updatedTodo = this.createQueryBuilder('todo')
      .update(TodoEntity)
      .set({
        title: input.title,
        description: input.description,
        status: input.status,
      })
      .where('id = :id', { id: todoId })
      .execute();

    return !!updatedTodo;
  }

  async getTodoById(id: string): Promise<TodoEntity | undefined> {
    return this.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getAllTodo(
    filter: TodoFilterDto,
    limit: number,
    skip: number,
    userId: string,
  ): Promise<TodoEntity[]> {
    const { status } = filter;
    return this.find({
      where: { user: { id: userId }, ...(status && { status }) },
      take: limit,
      skip,
    });
  }

  async countAllTodos(userId: string): Promise<number> {
    return this.count({
      where: { user: { id: userId } },
    });
  }
}
