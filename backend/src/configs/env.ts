//Read .env and append env var for config service
import { plainToClass } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { ToBoolean, ToNumber } from 'src/utils/transform';

enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

class EnvironmentVariables {
  @IsEnum(ENVIRONMENT)
  NODE_ENV!: ENVIRONMENT;

  @IsNumber()
  @ToNumber()
  PORT!: number;

  @IsBoolean()
  @ToBoolean()
  OPEN_PLAYGROUND!: boolean;

  @IsString()
  SERVICE_NAME!: string;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRES!: string;

  @IsString()
  LOG_SERVICE_NAME!: string;

  @IsBoolean()
  @ToBoolean()
  LOG_INLINE!: boolean;

  @IsString()
  DB_HOST!: string;

  @IsNumber()
  @ToNumber()
  DB_PORT!: number;

  @IsString()
  DB_USER!: string;

  @IsString()
  DB_PASSWORD!: string;

  @IsString()
  DB_NAME!: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config);
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const errorMessages: string[] = [];
  errors.forEach((error) => {
    for (const validation in error.constraints) {
      errorMessages.push(`${error.constraints[validation]}`);
    }
  });

  if (errorMessages.length > 0) {
    const msg = errorMessages?.join(', ');
    throw new Error(msg);
  }

  return validatedConfig;
}

export const ENV_CONFIG = () => ({
  IS_PROD: process.env.NODE_ENV === ENVIRONMENT.PRODUCTION,
});
