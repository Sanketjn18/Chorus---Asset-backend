import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  zone: string;

  @IsEnum(['thumb_up', 'thumb_down'], {
    message: 'Feedback must be thumb_up or thumb_down',
  })
  feedback: 'thumb_up' | 'thumb_down';
}
