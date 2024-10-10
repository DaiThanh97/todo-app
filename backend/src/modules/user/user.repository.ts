import { EntityRepository, Repository, InsertResult } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(email: string, password: string): Promise<InsertResult> {
    return this.createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        email,
        password,
      })
      .execute();
  }

  async getUserById(id: string): Promise<UserEntity | undefined> {
    return this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<UserEntity | undefined> {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }
}
