import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PreferencesDto } from '@app/types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: { email: string; password: string; name?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getPreferences(email: string): Promise<PreferencesDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { preferences: true },
    });

    return (user?.preferences as unknown as PreferencesDto) || {};
  }

  async setPreferences(email: string, preferences: PreferencesDto) {
    const user = await this.prisma.user.update({
      where: { email },
      data: {
        preferences: {
          ...(await this.getPreferences(email)), // Keep existing preferences
          ...preferences, // Set `news` to new array
        },
      },
    });

    console.log('Updated User:', user);
    const { password, ...result } = user;
    return result;
  }
}
