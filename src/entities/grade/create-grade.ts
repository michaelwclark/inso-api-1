import {
  IsOptional,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class GradeCriteria {
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
  @Length(1, 100)
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

  @ApiProperty({
    name: 'earned',
    description:
      'The number of points earned for the criteria by the participant',
    required: false,
    type: Number,
    isArray: false,
    example: 10,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public earned: number;

  constructor(partial: Partial<GradeCriteria>) {
    if (partial) {
      this.criteria = partial.criteria;
      this.max_points = partial.max_points;
      this.earned = partial.earned;
    }
  }
}

export class GradeDTO {
  @ApiProperty({
    name: 'total',
    description: 'The total grade',
    required: false,
    type: Number,
    isArray: false,
    example: 100,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  public total: number;

  @ApiProperty({
    name: 'criteria',
    description: 'Criteria for the grade',
    required: false,
    type: GradeCriteria,
    isArray: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GradeCriteria)
  public criteria: GradeCriteria[];

  @ApiProperty({
    name: 'comments',
    description: 'The total grade',
    required: false,
    type: String,
    isArray: false,
    example: 'Excellent work!',
  })
  @IsOptional()
  @IsString()
  public comments: string;

  constructor(partial: Partial<GradeDTO>) {
    if (partial) {
      this.total = partial.total;
      this.criteria = partial.criteria.map((criteria) => {
        criteria;
        return new GradeCriteria(criteria);
      });
      this.comments = partial.comments;

      let criteriaTotal = 0;
      this.criteria.forEach((criteria) => {
        criteriaTotal = criteriaTotal + criteria.earned;
      });
      if (this.total !== criteriaTotal) {
        throw new HttpException(
          'Criteria does not add to total',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
