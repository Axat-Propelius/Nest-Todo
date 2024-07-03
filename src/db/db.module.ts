import { Module } from '@nestjs/common';
import { knexSnakeCaseMappers } from 'objection';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from './models/user.model';
import { TodoModel } from './models/todo.model';

const models = [UserModel, TodoModel];

@Module({
  imports: [
    ObjectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory() {
        return {
          config: {
            client: 'pg',
            connection: process.env.DATABASE_URL,
            debug: process.env.KNEX_DEBUG === 'true',
            ...knexSnakeCaseMappers({}),
          },
        };
      },
    }),
    //Register your objection models, so it can be provided when needed.
    ObjectionModule.forFeature([...models]),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
