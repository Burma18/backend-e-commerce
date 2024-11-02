import { config } from 'dotenv';
import * as env from 'env-var';

config();

export const environment = {
  app: {
    port: env.get('PORT').required().default('5000').asPortNumber(),
    env: env.get('NODE_ENV').required().default('dev').asString(),
    prefix: env.get('PREFIX').default('api').asString(),
  },
  database: {
    host: env.get('POSTGRES_HOST').required().default('localhost').asString(),
    port: env.get('POSTGRES_PORT').required().default('5432').asPortNumber(),
    user: env.get('POSTGRES_USER').required().default('postgres').asString(),
    password: env.get('POSTGRES_PASSWORD').required().asString(),
    name: env.get('POSTGRES_DB').required().asString(),
  },
  payment: {
    cryptoPayTokenTest: env.get('CRYPTO_PAY_TOKEN_TEST').required().asString(),
    cryptoPayTokenProd: env.get('CRYPTO_PAY_TOKEN_PROD').required().asString(),
    hostNameTest: env.get('HOST_NAME_TEST').required().asString(),
    hostNameProd: env.get('HOST_NAME_PROD').required().asString(),
  },
};
