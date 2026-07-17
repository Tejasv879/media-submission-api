import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ListAdminMediaDto } from './dto/list-admin-media.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private email: EmailService) {}
  async list(query: ListAdminMediaDto) {
    const where = query.status ? { status: query.status } : {};
    const [data, total] = await this.prisma.$transaction([this.prisma.mediaSubmission.findMany({ where, include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' }, skip: (query.page - 1) * query.limit, take: query.limit }), this.prisma.mediaSubmission.count({ where })]);
    return { data, pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) } };
  }
  async decide(id: string, status: SubmissionStatus, reason?: string) {
    const item = await this.prisma.mediaSubmission.findUnique({ where: { id }, include: { user: true } });
    if (!item) throw new NotFoundException('Submission not found');
    if (item.status !== SubmissionStatus.PENDING) throw new BadRequestException('Only PENDING submissions can be approved or rejected');
    const updated = await this.prisma.mediaSubmission.update({ where: { id }, data: { status, rejectionReason: status === SubmissionStatus.REJECTED ? reason : null } });
    await this.email.sendDecision(item.user.email, item.user.name, item.title, status, reason);
    return updated;
  }
}
