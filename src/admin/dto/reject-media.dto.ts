import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RejectMediaDto {
  @ApiProperty({ example: 'The uploaded image does not meet the required quality.' })
  @IsString() @IsNotEmpty() @MaxLength(1000) reason: string;
}
