import { NewsCategory } from '@app/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';

export class SetNewsPreferencesDto {
  @ApiProperty({
    enum: NewsCategory,
    isArray: true,
    example: ['current', 'nyt', 'guardian'],
    description: 'Array of news categories to subscribe to',
  })
  @IsArray()
  @IsEnum(NewsCategory, { each: true })
  newsArray: NewsCategory[];
}
