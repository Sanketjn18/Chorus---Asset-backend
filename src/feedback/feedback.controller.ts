import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  UseGuards,
  Logger,
  Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/user/enum/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('feedback')
export class FeedbackController {
  private readonly logger = new Logger(FeedbackController.name);
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SuperAdmin)
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Req() req,
  ) {
    const userEmail = req.user.email; // Extract user email from JwtAuthGuard
    this.logger.log(
      `User ${userEmail} called create feedback endpoint : ${createFeedbackDto}`,
    );
    return this.feedbackService.addFeedback(createFeedbackDto, userEmail);
  }

  @Get()
  async getAllFeedback() {
    // const userEmail = req.user.email; // Extract user email from JwtAuthGuard
    // this.logger.log(`User ${userEmail} called get all feedback endpoint`);
    return this.feedbackService.getAllFeedback();
  }
}
