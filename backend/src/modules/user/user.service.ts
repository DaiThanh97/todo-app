import { Injectable } from '@nestjs/common';
import { SignUpInput } from '../../graphql';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser({ email, password }: SignUpInput): Promise<boolean> {
    const result = await this.userRepository.createUser(email, password);
    // Check if insert success
    const id = result.$response.data;
    return !!id;
  }

  async getUserById(userId: string) {
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }
}
