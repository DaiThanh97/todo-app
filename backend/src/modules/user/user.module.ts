import { Module } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  providers: [DynamoDB.DocumentClient, UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
