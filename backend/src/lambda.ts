import {
  Context,
  APIGatewayProxyHandler,
  ApiGatewayProxyEvent,
} from 'aws-lambda';
import { proxy, createServer } from 'aws-serverless-express';
import { Server } from 'http';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

let cachedServer: Server;

async function bootstrapServer(context: Context) {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet({ contentSecurityPolicy: false }));
    console.log('BOOTSTRAPPPPP');
    await app
      .init()
      .then(() => console.log('Todo app is ready'))
      .catch((err) => console.error('LOI NE: ', err));

    console.log('BOOTSTRAPPPPP 2222');

    cachedServer = createServer(expressApp, undefined);

    console.log('BOOTSTRAPPPPP 3333');
  }
  return cachedServer;
}

export const handler: APIGatewayProxyHandler = async (
  event: ApiGatewayProxyEvent,
  context,
) => {
  console.log('======Todo app is handlingggg=======');

  cachedServer = await bootstrapServer(context);

  console.log('======Todo app is okkkkk=======');

  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
