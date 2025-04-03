import { NewsCategory, SportsCategory } from '@app/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';

export class PreferencesDto {
  @ApiProperty({
    enum: NewsCategory,
    isArray: true,
    example: Object.values(NewsCategory),
    description: 'Array of news categories to subscribe to',
  })
  @IsArray()
  @IsEnum(NewsCategory, { each: true })
  news: NewsCategory[];

  @ApiProperty({
    enum: SportsCategory,
    isArray: true,
    example: Object.values(SportsCategory),
    description: 'Array of sports categories to subscribe to',
  })
  @IsArray()
  @IsEnum(SportsCategory, { each: true })
  sports: SportsCategory[];
}
