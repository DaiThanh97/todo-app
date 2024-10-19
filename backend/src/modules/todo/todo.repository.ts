import { CreateTodoDto, TodoFilterDto } from './todo.dto';
import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from 'rxjs';
import { ITodo } from './todo.interface';

@Injectable()
export class TodoRepository {
  tableName: string;
  constructor(
    private readonly configService: ConfigService,
    private dynamodb: DynamoDB.DocumentClient,
  ) {
    this.tableName = configService.get<string>('TODO_TABLE_NAME');
  }

  async createTodo(input: CreateTodoDto, userId: string) {
    const todo = await this.dynamodb
      .put({
        TableName: this.tableName,
        Item: {
          ...input,
          id: uuid(),
          userId,
        },
      })
      .promise();

    return todo.$response.data as ITodo;
  }

  async updateTodo(todoId: string, input: CreateTodoDto) {
    const updatedTodo = await this.dynamodb
      .update({
        TableName: this.tableName,
        Key: { id: todoId },
        UpdateExpression:
          'set title = :title, description = :description, status = :status',
        ExpressionAttributeNames: {
          '#title': 'title',
        },
        ExpressionAttributeValues: {
          ':title': input.title,
          ':description': input.description,
          ':status': input.status,
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return !!updatedTodo.$response.data;
  }

  async getTodoById(id: string) {
    const todo = await this.dynamodb
      .get({ TableName: this.tableName, Key: { id } })
      .promise();

    if (todo.$response.error) {
      throw new NotFoundError('todo not found');
    }

    return todo.$response.data as ITodo;
  }

  async getAllTodo(
    filter: TodoFilterDto,
    limit: number,
    skip: number,
    userId: string,
  ) {
    const { status } = filter;
    const todos = await this.dynamodb
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        ...(status && {
          FilterExpression: 'status = :status',
          ExpressionAttributeValues: {
            ':status': status,
          },
        }),
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: skip ? { id: skip } : undefined,
      })
      .promise();

    return todos.Items.map((todo) => ({
      ...todo,
      createDate: new Date(todo.createDate),
    })) as ITodo[];
  }

  async countAllTodos(userId: string): Promise<number> {
    return this.dynamodb
      .query({
        TableName: this.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
        Select: 'COUNT',
      })
      .promise()
      .then((data) => data.Count);
  }
}
