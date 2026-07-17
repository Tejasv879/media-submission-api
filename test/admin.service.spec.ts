import { BadRequestException } from '@nestjs/common';
import { SubmissionStatus } from '@prisma/client';
import { AdminService } from '../src/admin/admin.service';

describe('AdminService', () => {
  const prisma: any = { mediaSubmission: { findUnique: jest.fn(), update: jest.fn() } };
  const email: any = { sendDecision: jest.fn() };
  const service = new AdminService(prisma, email);
  beforeEach(() => jest.clearAllMocks());
  it('approves a pending submission and sends an email', async () => {
    prisma.mediaSubmission.findUnique.mockResolvedValue({ id: '1', title: 'Photo', status: SubmissionStatus.PENDING, user: { email: 'user@test.com', name: 'User' } });
    prisma.mediaSubmission.update.mockResolvedValue({ id: '1', status: SubmissionStatus.APPROVED });
    await expect(service.decide('1', SubmissionStatus.APPROVED)).resolves.toEqual({ id: '1', status: SubmissionStatus.APPROVED });
    expect(email.sendDecision).toHaveBeenCalledWith('user@test.com', 'User', 'Photo', SubmissionStatus.APPROVED, undefined);
  });
  it('does not approve a submission twice', async () => {
    prisma.mediaSubmission.findUnique.mockResolvedValue({ id: '1', status: SubmissionStatus.APPROVED, user: {} });
    await expect(service.decide('1', SubmissionStatus.APPROVED)).rejects.toBeInstanceOf(BadRequestException);
  });
});
