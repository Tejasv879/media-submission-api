import { ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { MediaService } from '../src/media/media.service';
describe('MediaService', () => {
  it('does not let a user read someone else’s submission', async () => {
    const prisma: any = { mediaSubmission: { findUnique: jest.fn().mockResolvedValue({ id: 'media-1', userId: 'owner-id' }) } };
    const service = new MediaService(prisma);
    await expect(service.findOne('media-1', { id: 'other-id', email: 'other@test.com', name: 'Other', role: Role.USER })).rejects.toBeInstanceOf(ForbiddenException);
  });
});
