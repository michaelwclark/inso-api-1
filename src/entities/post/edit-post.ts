import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
export class PostTypeUpdateDTO {
  @ApiProperty({
    name: 'post',
    description: 'Updates to the post text',
    required: false,
    type: String,
    isArray: false,
    example: 'I like potato pancakes with ketchup',
  })
  @IsString()
  post: string;

  @ApiProperty({
    name: 'outline',
    description: 'Updates to the outline of the post',
    required: false,
    type: Object,
    isArray: false,
    example: 'I like potato pancakes with ketchup',
  })
  outline: any;
}
export class PostUpdateDTO {
  @ApiProperty({
    name: 'post',
    description: 'Updates to the post',
    required: false,
    type: PostTypeUpdateDTO,
    isArray: false,
    example: {
      post: 'I like cream cheese on my bagel',
      outline: {
        inspirationOutline1: 'Do you like bagels?',
        inspirationOutline2:
          ' I want to find out who likes cream cheese on their bagel',
        inspirationOutline3:
          'I suspect people like regular cream cheese rather than strawberry',
      },
    },
  })
  @IsDefined()
  post: PostTypeUpdateDTO;

  @ApiProperty({
    name: 'post_inspiration',
    description: 'If there was a post inspiration used this is the ID',
    required: false,
    type: String,
    isArray: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsOptional()
  post_inspiration: Types.ObjectId;

  constructor(partial: Partial<PostUpdateDTO>) {
    if (partial) {
      this.post = partial.post;
      this.post_inspiration = partial.post_inspiration;

      if (
        this.post_inspiration &&
        Object.keys(this.post.outline).length !== 3
      ) {
        throw new HttpException(
          'If using a post inspiration the outline must have 3 attributes',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!this.post_inspiration && this.post.outline && Object.keys(this.post.outline).length > 0) {
        throw new HttpException(
          'No post inspiration specified. You cannot have an outline',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (this.post_inspiration && !this.post.outline) {
        throw new HttpException(
          'If using a post inspiration the outline must be included',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
