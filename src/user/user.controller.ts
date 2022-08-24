import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './UserDto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body() registerData: { username: string; email: string; password: string },
  ): Promise<UserDto> {
    return this.userService.createUser(registerData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    return req.user;
  }
}
