import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { TodoModel } from 'src/db/models/todo.model';

@Module({
  imports: [ObjectionModule.forFeature([TodoModel])],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
