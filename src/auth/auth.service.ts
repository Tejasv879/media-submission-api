import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) throw new ConflictException('Email is already registered');
    const password = await bcrypt.hash(dto.password, 10); // Never store the raw password.
    const user = await this.prisma.user.create({ data: { name: dto.name, email, password } });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) throw new UnauthorizedException('Invalid email or password');
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    return { accessToken: await this.jwt.signAsync(payload), user: payload };
  }
}
