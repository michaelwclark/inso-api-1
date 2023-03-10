import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class PostTypeCreateDTO {
  @ApiProperty({
    name: 'post',
    description: 'The text of the post or the outline for the inspiration',
    required: false,
    type: PostTypeCreateDTO,
    isArray: false,
    example: 'I like potato pancakes.',
  })
  post: string;

  @ApiProperty({
    name: 'outline',
    description: 'The text of the post or the outline for the inspiration',
    required: false,
    type: Object,
    isArray: false,
    example: {},
  })
  outline: any;

  constructor(partial: Partial<PostTypeCreateDTO>) {
    if (partial) {
      this.post = partial.post;
      this.outline = partial.outline;
    }
  }
}
export class PostCreateDTO {
  @ApiProperty({
    name: 'draft',
    description: 'Determines if a post is in the draft state',
    required: true,
    type: Boolean,
    isArray: false,
    example: true,
  })
  @IsBoolean()
  @IsDefined()
  draft: boolean;

  @ApiProperty({
    name: 'comment_for',
    description: 'If the post is a comment for another post',
    required: false,
    type: String,
    isArray: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsOptional()
  comment_for: Types.ObjectId;

  @ApiProperty({
    name: 'post',
    description: 'The text of the post or the outline for the inspiration',
    required: false,
    type: PostTypeCreateDTO,
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
  @Type(() => PostTypeCreateDTO)
  @IsDefined()
  post: PostTypeCreateDTO;

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

  constructor(partial: Partial<PostCreateDTO>) {
    if (partial) {
      this.draft = partial.draft;
      this.comment_for = partial.comment_for;
      this.post = partial.post;
      this.post_inspiration = partial.post_inspiration;

      if (
        this.post_inspiration &&
        this.post.outline &&
        Object.keys(this.post.outline).length !== 3
      ) {
        throw new HttpException(
          'If using a post inspiration the outline must have 3 attributes',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (this.post_inspiration && !this.post.outline) {
        throw new HttpException(
          'If using a post inspiration the outline must be included',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        !this.post_inspiration &&
        this.post.outline &&
        Object.keys(this.post.outline).length > 0
      ) {
        throw new HttpException(
          'No post inspiration specified. You cannot have an outline',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
