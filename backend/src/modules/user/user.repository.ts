import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from 'rxjs';
import { IUser } from './user.interface';

@Injectable()
export class UserRepository {
  tableName: string;
  constructor(
    private readonly configService: ConfigService,
    private dynamodb: DynamoDB.DocumentClient,
  ) {
    this.tableName = configService.get<string>('USER_TABLE_NAME');
  }

  async createUser(email: string, password: string) {
    return this.dynamodb
      .put({
        TableName: this.tableName,
        Item: {
          id: uuid(),
          email,
          password,
          createDate: new Date().toISOString(),
          todos: [],
        },
      })
      .promise();
  }

  async getUserById(id: string) {
    const user = await this.dynamodb
      .get({ TableName: this.tableName, Key: { id } })
      .promise();

    if (user.$response.error) {
      throw new NotFoundError('User not found');
    }

    return user.$response.data as IUser;
  }

  async getUserByEmail(email: string) {
    const user = await this.dynamodb
      .get({ TableName: this.tableName, Key: { email } })
      .promise();

    if (user.$response.error) {
      throw new NotFoundError('User not found');
    }

    return user.$response.data as IUser;
  }
}
