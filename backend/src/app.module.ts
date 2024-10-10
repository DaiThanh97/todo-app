import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { join } from 'path';
import { ENV_CONFIG, validate } from './configs/env';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { formatError } from './utils/formatError';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      isGlobal: true,
      cache: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          logging: !configService.get<string>('IS_PROD'),
          migrations: [__dirname + '/migration/**/*.{js,ts}'],
          retryAttempts: 3,
          retryDelay: 3000,
          cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber',
          },
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        debug: !configService.get<string>('IS_PROD'),
        playground: configService.get<boolean>('OPEN_PLAYGROUND'),
        introspection: !configService.get<string>('IS_PROD'),
        typePaths: ['./**/*.graphql'],
        formatError,
        definitions: {
          path: join(process.cwd(), 'src', 'graphql.ts'),
          outputAs: 'class',
        },
      }),
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        level: configService.get<string>('LOG_LEVEL'),
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.errors({ stack: true }),
          format.colorize(),
          format.simple(),
        ),
        transports: new transports.Console({
          stderrLevels: ['error'],
          consoleWarnLevels: ['warn'],
        }),
        exceptionHandlers: new transports.Console(),
        exitOnError: false,
      }),
    }),
    AuthModule,
    UserModule,
    TodoModule,
  ],
})
export class AppModule {}
