import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

export class SettingsCreateDTO {
  @ApiProperty({
    name: 'starter_prompt',
    description: 'The starter prompt for the discussion',
    required: true,
    type: String,
    isArray: false,
    example: 'Create a discussion',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 1000)
  @IsOptional()
  public starter_prompt: string;

  @ApiProperty({
    name: 'post_inspirations',
    description: 'This will be an ObjectId to a post inspiration entity',
    required: true,
    type: Types.ObjectId,
    isArray: true,
    example: ['629e4f4bf4f393cf1e534b20'],
  })
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  public post_inspirations: Types.ObjectId[];

  @ApiProperty({
    name: 'score',
    description: 'This will be an ObjectId to a score entity',
    required: true,
    type: Types.ObjectId,
    isArray: false,
    example: '629e4f4bf4f393cf1e534b20',
  })
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @IsMongoId()
  @IsOptional()
  public score: Types.ObjectId;

  @ApiProperty({
    name: 'calendar',
    description: 'This will be an ObjectId to a calendar entity',
    required: true,
    type: Types.ObjectId,
    isArray: false,
    example: '629e4f4bf4f393cf1e534b20',
  })
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @IsMongoId()
  @IsOptional()
  public calendar: Types.ObjectId;

  constructor(partial: Partial<SettingsCreateDTO>) {
    Object.assign(this, partial);
  }
}
