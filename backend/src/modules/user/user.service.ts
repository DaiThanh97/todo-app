import { Injectable } from '@nestjs/common';
import { SignUpInput } from '../../graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser({ email, password }: SignUpInput): Promise<boolean> {
    const result = await this.userRepository.createUser(email, password);
    // Check if insert success
    const id = result.identifiers[0].id;
    return !!id;
  }

  async getUserById(userId: string): Promise<UserEntity | undefined> {
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    console.log('userRepository', this.userRepository);

    return this.userRepository.getUserByEmail(email);
  }
}
