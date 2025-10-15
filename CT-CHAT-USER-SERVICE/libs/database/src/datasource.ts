import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { entities } from './entities';
import { migrations } from './migrations';

ConfigModule.forRoot();
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [...entities],
  migrations: [...migrations],
  migrationsTableName: 'migrations_table',
  logger: 'advanced-console',
  logging: true,
  synchronize: false, // never use TRUE in production!
  // migrationsRun: true
});