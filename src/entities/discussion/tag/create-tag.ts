import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DiscussionTagCreateDTO {
  @ApiProperty({
    name: 'tag',
    description:
      'The tag that should be added to the tags array for the discussion',
    required: true,
    type: String,
    isArray: false,
    example: 'nuclear',
  })
  @IsNotEmpty()
  @IsString()
  public tag: string;

  constructor(partial: Partial<DiscussionTagCreateDTO>) {
    if (partial) {
      this.tag = partial.tag;
    }
  }
}
