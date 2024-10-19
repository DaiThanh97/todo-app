import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';
import { LoginDto, SignUpDto } from './auth.dto';
import { LoginResponse, User } from '../../graphql';
import {
  AuthError,
  NOT_AUTHENTICATED,
  EMAIL_EXISTS,
  USER_NOT_FOUND,
} from './auth.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginDto;
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new AuthError(NOT_AUTHENTICATED);
      }

      const checkValidPassword = await argon.verify(user.password, password);
      if (!checkValidPassword) {
        throw new AuthError(NOT_AUTHENTICATED);
      }

      // If valid credentials
      const payload: JwtPayload = {
        sub: user.id,
        email,
      };

      // Provision jwt
      const accessToken = this.jwtService.sign(payload);
      return {
        id: user.id,
        email,
        accessToken,
      };
    } catch (err) {
      throw new AuthError(err);
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    try {
      const { email, password } = signUpDto;
      const user = await this.usersService.getUserByEmail(email);
      if (user) {
        throw new AuthError(EMAIL_EXISTS);
      }

      // Hash password
      const hashedPassword = await argon.hash(password);
      return this.usersService.createUser({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      throw new AuthError(err);
    }
  }

  async getUserByToken(token: string): Promise<User> {
    try {
      const decodedUser = this.jwtService.verify(token);
      const user = await this.usersService.getUserById(decodedUser.sub);
      if (!user) {
        throw new AuthError(USER_NOT_FOUND);
      }

      return user as User;
    } catch (err) {
      throw new AuthError(err);
    }
  }
}
