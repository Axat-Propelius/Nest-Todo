import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { RoleModel } from 'src/db/models/role.model';

@Module({
  imports: [ObjectionModule.forFeature([RoleModel])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
