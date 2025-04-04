import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { Message } from '@app/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user: User = await lastValueFrom(
        this.userServiceClient.send(Message.VALIDATE_USER, { email, password }),
      );
      if (user) {
        return user;
      }
      return null;
    } catch (error: any) {
      throw new HttpException(
        `Authentication service unavailable : ${error}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async signup(signupDto: any) {
    try {
      const user: User = await lastValueFrom(
        this.userServiceClient.send(Message.CREATE_USER, signupDto),
      );
      return user;
    } catch (error: unknown) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(
        'Registration service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
