import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './schemas/feedback.entity';
import { FeedbackRepository } from './repository/feedback.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]), // Register the Asset entity
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository],
})
export class FeedbackModule {}
