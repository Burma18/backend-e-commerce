import { Module } from '@nestjs/common';
import { NewsletterController } from './controllers/newsletter.controller';
import { NewsletterService } from './services/newsletter.service';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
