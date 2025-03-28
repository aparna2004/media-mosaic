import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { SignupDto } from './dto/auth.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE') private userServiceClient: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    const user: User = await lastValueFrom(
      this.userServiceClient.send('validate_user', { email, password }),
    );

    if (user) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto) {
    try {
      const user: User = await lastValueFrom(
        this.userServiceClient.send('create_user', signupDto),
      );
      return user;
    } catch (error: any) {
      if (error.message?.includes('Unique constraint')) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
