import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReactionDTO {
  @ApiProperty({
    name: 'userId',
    description: 'The mongo id of the user',
    required: false,
    type: String,
    isArray: false,
    example: '507f1f77bcf86cd799439011',
  })
  @IsMongoId()
  @IsDefined()
  userId: Types.ObjectId;

  @ApiProperty({
    name: 'reaction',
    description: 'The emoji code for the reaction',
    required: false,
    type: String,
    isArray: false,
    example: '+1',
  })
  @IsDefined()
  @IsString()
  reaction: string;

  @ApiProperty({
    name: 'unified',
    description: 'The unified emoji code for the reaction',
    required: false,
    type: String,
    isArray: false,
    example: '1f618',
  })
  @IsDefined()
  @IsString()
  unified: string;

  constructor(partial: Partial<CreateReactionDTO>) {
    if (partial) {
      this.userId = new Types.ObjectId(partial.userId);
      this.reaction = partial.reaction;
    }
  }
}
