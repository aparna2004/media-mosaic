import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JsonObject, JsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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

  async getPreferences(email: string): Promise<JsonObject> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { preferences: true },
    });

    return user?.preferences || {};
  }

  async getNewsPreferences(email: string): Promise<string[]> {
    const preferences = await this.getPreferences(email);
    const newsPreferences = preferences?.news || [];
    console.log('News:', newsPreferences);
    return preferences?.news || [];
  }

  async setNewsPreferences(email: string, newsArray: string[]) {
    const user = await this.prisma.user.update({
      where: { email },
      data: {
        preferences: {
          ...await this.getPreferences(email), // Keep existing preferences
          news: newsArray, // Set `news` to new array
        },
      },
    });

    console.log('Updated User:', user);
    const { password, ...result } = user;
    return result;
  }
}
