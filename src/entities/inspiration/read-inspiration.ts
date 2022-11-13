import { ApiProperty } from '@nestjs/swagger';
import { Inspiration } from './inspiration';

export class InspirationRead {
  @ApiProperty({
    name: 'cat',
    description: 'The type of the inspirations',
    required: false,
    type: String,
    isArray: false,
    example: 'topic',
  })
  cat: string;

  @ApiProperty({
    name: 'values',
    description: 'The inspirations under the type',
    required: false,
    type: String,
    isArray: false,
  })
  values: Inspiration[];
}

export class InspirationReadResponse {
  @ApiProperty({
    name: 'posting',
    description: 'The posting inspirations',
    required: false,
    type: [InspirationRead],
    isArray: true,
  })
  posting: InspirationRead[];

  @ApiProperty({
    name: 'responding',
    description: 'The responding inspirations',
    required: false,
    type: [InspirationRead],
    isArray: true,
  })
  responding: InspirationRead[];

  @ApiProperty({
    name: 'synthesizing',
    description: 'The synthesizing inspirations',
    required: false,
    type: [InspirationRead],
    isArray: true,
  })
  synthesizing: InspirationRead[];
}
