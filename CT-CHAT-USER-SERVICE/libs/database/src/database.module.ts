import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AppDataSource } from './datasource';
import { repositories } from './repositories';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([...entities]),
  ],
  providers: [...entities, ...repositories],
  exports: [...entities, ...repositories],
})
export class DatabaseModule { }