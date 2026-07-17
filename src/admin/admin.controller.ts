import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, SubmissionStatus } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { ListAdminMediaDto } from './dto/list-admin-media.dto';
import { RejectMediaDto } from './dto/reject-media.dto';
@ApiTags('admin') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN) @Controller('admin/media')
export class AdminController {
  constructor(private admin: AdminService) {}
  @Get()
  @ApiQuery({ name: 'status', required: false, enum: SubmissionStatus, description: 'Optional status filter' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number, starting from 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Results per page (maximum 100)' })
  list(@Query() query: ListAdminMediaDto) { return this.admin.list(query); }
  @Patch(':id/approve') approve(@Param('id') id: string) { return this.admin.decide(id, SubmissionStatus.APPROVED); }
  @Patch(':id/reject') reject(@Param('id') id: string, @Body() dto: RejectMediaDto) { return this.admin.decide(id, SubmissionStatus.REJECTED, dto.reason); }
}
