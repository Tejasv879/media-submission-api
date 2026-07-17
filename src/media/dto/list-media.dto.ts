import { SubmissionStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class ListMediaDto {
  @ApiPropertyOptional({ enum: SubmissionStatus, example: SubmissionStatus.PENDING })
  @IsOptional() @IsEnum(SubmissionStatus) status?: SubmissionStatus;
}
