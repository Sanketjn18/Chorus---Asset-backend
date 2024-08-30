// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser.email);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.OK)
  async login(@Body() userCred: LoginUserDto) {
    return this.authService.login(userCred.email, userCred.password);
  }

  @Post('forgotPassword')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const otp = await this.authService.forgetPassword(forgotPasswordDto.email);
    // return { message: 'OTP sent to email' };
    return otp;
  }

  @Post('verifyOtp')
  @UsePipes(new ValidationPipe({ transform: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const token = await this.authService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
    return { message: 'OTP verified', token };
  }

  @Post('resetPassword')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    const resetResponse = await this.authService.resetPassword(
      req.user?.email,
      resetPasswordDto.newPassword,
    );
    return { message: 'Password reset successfully', resetResponse };
  }
}
