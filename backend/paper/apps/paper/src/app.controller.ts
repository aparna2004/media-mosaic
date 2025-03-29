import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getProtectedRoute(@Request() req :any) {
    return {
      message: 'This is a protected route:)',
      userId: req.user.userId,
      email: req.user.email,
    };
  }
}
