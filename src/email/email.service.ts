import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);
  constructor(private config: ConfigService) {}
  async sendDecision(email: string, name: string, title: string, status: SubmissionStatus, reason?: string | null) {
    if (this.config.get('EMAIL_ENABLED') !== 'true') { this.logger.log(`Email disabled: ${status} notification for ${email}`); return; }
    try {
      const transporter = nodemailer.createTransport({ host: this.config.getOrThrow('EMAIL_HOST'), port: Number(this.config.get('EMAIL_PORT') || 587), auth: { user: this.config.getOrThrow('EMAIL_USER'), pass: this.config.getOrThrow('EMAIL_PASSWORD') } });
      const message = status === SubmissionStatus.APPROVED ? `Your submission “${title}” was approved.` : `Your submission “${title}” was rejected. Reason: ${reason}`;
      await transporter.sendMail({ from: this.config.getOrThrow('EMAIL_FROM'), to: email, subject: `Submission ${status.toLowerCase()}`, text: `Hello ${name},\n\n${message}` });
    } catch (error) {
      // A review decision is already saved. Email failure must not reverse that decision.
      this.logger.error(`Could not send decision email to ${email}`, error instanceof Error ? error.stack : undefined);
    }
  }
}
