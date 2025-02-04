import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../schemas/feedback.entity';
@Injectable()
export class FeedbackRepository {
  private readonly logger = new Logger(FeedbackRepository.name);
  constructor(
    @InjectRepository(Feedback)
    private readonly repository: Repository<Feedback>,
  ) {}

  async createFeedback(data: Partial<Feedback>): Promise<Feedback> {
    const feedback = this.repository.create(data);
    return this.repository.save(feedback);
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await this.repository.find();
  }
}
