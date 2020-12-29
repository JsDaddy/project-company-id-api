import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailController } from './controllers/mail.controller';

@Module({
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
