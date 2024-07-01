import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRoles } from 'src/utils/constants';
import { RoleService } from './role.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('roles')
@UseGuards(JwtAuthGuard)
@Roles(UserRoles.ADMIN, UserRoles.MANAGER)
export class RoleController {
  constructor(private rolesService: RoleService) {}

  @Get('/')
  @ApiBearerAuth('access-token')
  async getRoles() {
    return this.rolesService.getAllRoles();
  }
}
