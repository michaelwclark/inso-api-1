import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OutlineCreateDTO {
  @ApiProperty({
    name: 'header',
    description: 'The header for the part of the outline',
    required: true,
    type: String,
    isArray: false,
    example: 'Outline try 1s',
  })
  @IsNotEmpty()
  @IsString()
  public header: string;

  @ApiProperty({
    name: 'prompt',
    description: 'The prompt for the header for the part of the outline',
    required: true,
    type: String,
    isArray: false,
    example: 'Outline try 1s',
  })
  @IsNotEmpty()
  @IsString()
  public prompt: string;

  constructor(partial: Partial<OutlineCreateDTO>) {
    Object.assign(this, partial);
  }
}

export class InspirationCreateDTO {
  @ApiProperty({
    name: 'type',
    description:
      'The type of the inspiration: responding, posting, synthesizing are the only valid options',
    required: true,
    type: String,
    isArray: false,
    example: 'responding',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['responding', 'posting', 'synthesizing'])
  public type: string;

  @ApiProperty({
    name: 'name',
    description: 'The name of the inspiration',
    required: true,
    type: String,
    isArray: false,
    example: 'poll',
  })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({
    name: 'instructions',
    description: 'The instructions for the post inspiration',
    required: true,
    type: String,
    isArray: false,
    example: 'Create a poll for your class',
  })
  @IsNotEmpty()
  @IsString()
  public instructions: string;

  @ApiProperty({
    name: 'outline',
    description: 'The outline array for the discussion inspiration',
    required: true,
    type: [OutlineCreateDTO],
    isArray: false,
    example: 'Create a poll for your class',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OutlineCreateDTO)
  public outline: OutlineCreateDTO[];

  constructor(partial: Partial<InspirationCreateDTO>) {
    Object.assign(this, partial);
  }
}
