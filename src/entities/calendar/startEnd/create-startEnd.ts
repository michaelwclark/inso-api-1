import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate } from 'class-validator';

export class CreateStartEnd {
  @ApiProperty({
    name: 'open',
    description: 'The date and time that the time frame begins',
    required: true,
    type: Date,
    isArray: false,
    example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  open: Date;

  @ApiProperty({
    name: 'close',
    description: 'The date and time that the time frame ends',
    required: true,
    type: Date,
    isArray: false,
    example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  close: Date;

  constructor(partial: Partial<CreateStartEnd>) {
    Object.assign(this, partial);
  }
}
