import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

function baseFolder(): string {
  const regex = /common+(\/|\\)+config/gi;
  return __dirname.replace(regex, '');
}

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  logging: configService.get<boolean>('DB_LOGGING'),
  entities: [baseFolder() + '/src/models/**/*{.ts,.js}'],
  migrations: [baseFolder() + '/src/database/migrations/**/*{.ts,.js}'],
});
