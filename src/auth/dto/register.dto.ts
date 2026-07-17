import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty({ description: 'User full name' })
  @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ description: 'User email address' })
  @IsEmail() email: string;
  @ApiProperty({ description: 'Password with at least 8 characters', minLength: 8 })
  @IsString() @MinLength(8) password: string;
}
