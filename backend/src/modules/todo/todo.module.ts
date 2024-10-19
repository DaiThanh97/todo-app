import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { DynamoDB } from 'aws-sdk';

@Module({
  providers: [
    DynamoDB.DocumentClient,
    TodoRepository,
    TodoResolver,
    TodoService,
  ],
})
export class TodoModule {}
