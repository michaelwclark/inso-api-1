import {
  IsBoolean,
  IsOptional,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAutoRequirements {
  @ApiProperty({
    name: 'max_points',
    description:
      'The max number of points that can be earned for posts, active days, or comments',
    required: false,
    type: Number,
    isArray: false,
    example: 10,
  })
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  public max_points: number;

  @ApiProperty({
    name: 'required',
    description:
      'The required number of posts, active days, or comments received to get full points',
    required: false,
    type: Number,
    isArray: false,
    example: 5,
  })
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  public required: number;

  constructor(partial: Partial<CreateAutoRequirements>) {
    if (partial) {
      this.max_points = partial.max_points;
      this.required = partial.required;
    }
  }
}

export class CreatePostInspirationOptions {
  @ApiProperty({
    name: 'selected',
    description:
      'Boolean to determine if post inspirations are a factor in scoring',
    required: false,
    type: Boolean,
    isArray: false,
    example: true,
  })
  @IsBoolean()
  @IsDefined()
  @IsNotEmpty()
  public selected: boolean;

  @ApiProperty({
    name: 'max_points',
    description: 'The maximum number of points for using post inspirations',
    required: false,
    type: Number,
    isArray: false,
    example: 10,
  })
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  public max_points: number;

  constructor(partial: Partial<CreatePostInspirationOptions>) {
    if (partial) {
      this.selected = partial.selected;
      this.max_points = partial.max_points;
    }
  }
}

export class CreateGradingCriteria {
  @ApiProperty({
    name: 'criteria',
    description: 'The criteria for the rubric portion',
    required: false,
    type: String,
    isArray: false,
    maxLength: 100,
    example: 'Post 4 times',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  public criteria: string;

  @ApiProperty({
    name: 'max_points',
    description: 'The maximum number of points for the criteria',
    required: false,
    type: Number,
    isArray: false,
    example: 10,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  public max_points: number;

  constructor(partial: Partial<CreateGradingCriteria>) {
    if (partial) {
      this.criteria = partial.criteria;
      this.max_points = partial.max_points;
    }
  }
}

export class ScoreCreateDTO {
  @ApiProperty({
    name: 'type',
    description: 'Auto or Rubric',
    required: true,
    type: String,
    isArray: false,
    example: 'auto',
    enum: ['auto', 'rubric'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['auto', 'rubric'])
  public type: string;

  @ApiProperty({
    name: 'total',
    description: 'The total number of points available for the discussion',
    required: false,
    type: Number,
    isArray: false,
    example: 40,
  })
  @IsNumber()
  @IsDefined()
  public total: number;

  @ApiProperty({
    name: 'posts_made',
    description:
      'Requirements for posts_made which includes max points possible and the requirement to receive those',
    required: false,
    type: CreateAutoRequirements,
    isArray: false,
  })
  @ValidateIf((obj) => obj.type === 'auto')
  @ValidateNested()
  @Type(() => CreateAutoRequirements)
  public posts_made: CreateAutoRequirements;

  @ApiProperty({
    name: 'active_days',
    description:
      'Requirements for active_days which includes max points possible and the requirement to receive those',
    required: false,
    type: CreateAutoRequirements,
    isArray: false,
  })
  @ValidateIf((obj) => obj.type === 'auto')
  @ValidateNested()
  @Type(() => CreateAutoRequirements)
  public active_days: CreateAutoRequirements;

  @ApiProperty({
    name: 'comments_received',
    description:
      'Requirements for comments_received which includes max points possible and the requirement to receive those',
    required: false,
    type: CreateAutoRequirements,
    isArray: false,
  })
  @ValidateIf((obj) => obj.type === 'auto')
  @ValidateNested()
  @Type(() => CreateAutoRequirements)
  public comments_received: CreateAutoRequirements;

  @ApiProperty({
    name: 'post_inspirations',
    description:
      'Requirements for posts_made which includes max points possible and the requirement to receive those',
    required: false,
    type: CreatePostInspirationOptions,
    isArray: false,
  })
  @ValidateIf((obj) => obj.type === 'auto')
  @ValidateNested()
  @Type(() => CreatePostInspirationOptions)
  public post_inspirations: CreatePostInspirationOptions;

  @ApiProperty({
    name: 'criteria',
    description: 'Requirements for rubric based scoring',
    required: false,
    type: [CreateGradingCriteria],
    isArray: true,
  })
  @ValidateIf((obj) => obj.type === 'rubric')
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateGradingCriteria)
  public criteria: CreateGradingCriteria[];

  constructor(partial: Partial<ScoreCreateDTO>) {
    if (partial) {
      this.type = partial.type;
      this.total = partial.total;

      if (this.type === 'auto') {
        this.posts_made = partial.posts_made;
        this.active_days = partial.active_days;
        this.comments_received = partial.comments_received;
        this.post_inspirations = partial.post_inspirations;
      }
      if (this.type === 'rubric') {
        this.criteria = partial.criteria;
      }
    }
  }
}
