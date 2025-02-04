import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackRepository } from './repository/feedback.repository';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepo: FeedbackRepository) {}

  async addFeedback(dto: CreateFeedbackDto, userEmail) {
    const { deviceId, zone, feedback } = dto;

    // Create and save feedback
    return this.feedbackRepo.createFeedback({
      deviceId,
      userEmail,
      zone,
      feedback,
    });
  }

  async getAllFeedback() {
    return this.feedbackRepo.getAllFeedback();
  }
}
