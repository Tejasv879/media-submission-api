import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { JwtUser } from '../auth/jwt.strategy';
import { Role, SubmissionStatus } from '@prisma/client';
import { access, unlink } from 'fs/promises';
import { resolve, sep } from 'path';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateMediaDto, file: Express.Multer.File, user: JwtUser) {
    if (!file) throw new BadRequestException('A media file is required');
    return this.prisma.mediaSubmission.create({ data: { ...dto, fileName: file.originalname, filePath: file.path.replaceAll('\\', '/'), mimeType: file.mimetype, fileSize: file.size, userId: user.id } });
  }
  mySubmissions(user: JwtUser, status?: SubmissionStatus) { return this.prisma.mediaSubmission.findMany({ where: { userId: user.id, ...(status ? { status } : {}) }, orderBy: { createdAt: 'desc' } }); }
  async findOne(id: string, user: JwtUser) {
    const item = await this.prisma.mediaSubmission.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Submission not found');
    if (user.role !== Role.ADMIN && item.userId !== user.id) throw new ForbiddenException('You can only access your own submission');
    return item;
  }
  async getFile(id: string, user: JwtUser) {
    const item = await this.findOne(id, user);
    const uploadsDirectory = resolve(process.cwd(), 'uploads');
    const absolutePath = resolve(process.cwd(), item.filePath);

    // Never serve a path outside the local uploads directory.
    if (!absolutePath.startsWith(`${uploadsDirectory}${sep}`)) throw new NotFoundException('Stored file not found');
    try { await access(absolutePath); } catch { throw new NotFoundException('Stored file not found'); }
    return { item, absolutePath };
  }
  async remove(id: string, user: JwtUser) {
    const item = await this.findOne(id, user);
    if (item.userId !== user.id) throw new ForbiddenException('Only the owner can delete this submission');
    if (item.status !== SubmissionStatus.PENDING) throw new BadRequestException('Only PENDING submissions can be deleted');
    await this.prisma.mediaSubmission.delete({ where: { id } });
    try { await unlink(item.filePath); } catch { /* File may already be absent; database deletion still succeeds. */ }
    return { message: 'Submission deleted' };
  }
}
