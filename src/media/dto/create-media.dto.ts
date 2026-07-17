import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateMediaDto {
  @ApiProperty({ description: 'Short title for the media submission' })
  @IsString() @IsNotEmpty() @MaxLength(150) title: string;
  @ApiPropertyOptional({ description: 'Optional details about the media' })
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
}
