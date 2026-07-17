import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';

@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, EmailModule, AuthModule, MediaModule, AdminModule] })
export class AppModule {}
