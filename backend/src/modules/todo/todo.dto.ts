import { TodoFilterInput, TodoStatus, CreateTodoInput } from '../../graphql';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TodoFilterDto implements TodoFilterInput {
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}

export class CreateTodoDto implements CreateTodoInput {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  title: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTodoDto extends CreateTodoDto {}
