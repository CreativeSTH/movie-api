import { Module } from '@nestjs/common';
import { EmailSender } from './emailsender.service';

@Module({
  providers: [EmailSender],       
  exports: [EmailSender],
})
export class EmailModule {}
