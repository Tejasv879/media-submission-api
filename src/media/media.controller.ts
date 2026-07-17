import { Body, Controller, Delete, Get, Param, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtUser } from '../auth/jwt.strategy';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { ListMediaDto } from './dto/list-media.dto';

const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
@ApiTags('media') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('media')
export class MediaController {
  constructor(private media: MediaService) {}
  @Post() @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['title', 'file'], properties: { title: { type: 'string', description: 'Short title for the media submission' }, description: { type: 'string', description: 'Optional details about the media' }, file: { type: 'string', format: 'binary', description: 'PDF, JPEG, PNG, WebP, MP4, or WebM file under 10 MB' } } } })
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: 'uploads', filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`) }), limits: { fileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, allowedMimeTypes.includes(file.mimetype)) }))
  create(@Body() dto: CreateMediaDto, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: JwtUser) { return this.media.create(dto, file, user); }
  @Get('my-submissions') mine(@Query() query: ListMediaDto, @CurrentUser() user: JwtUser) { return this.media.mySubmissions(user, query.status); }
  @Get(':id/view') @ApiOperation({ summary: 'Open a media file in the browser (owner or admin)' }) @ApiProduces('image/*', 'video/*', 'application/pdf')
  async view(@Param('id') id: string, @CurrentUser() user: JwtUser, @Res() response: Response) {
    const file = await this.media.getFile(id, user);
    response.type(file.item.mimeType).sendFile(file.absolutePath);
  }
  @Get(':id/download') @ApiOperation({ summary: 'Download a media file (owner or admin)' })
  async download(@Param('id') id: string, @CurrentUser() user: JwtUser, @Res() response: Response) {
    const file = await this.media.getFile(id, user);
    response.download(file.absolutePath, file.item.fileName);
  }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser() user: JwtUser) { return this.media.findOne(id, user); }
  @Delete(':id') remove(@Param('id') id: string, @CurrentUser() user: JwtUser) { return this.media.remove(id, user); }
}
