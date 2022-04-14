import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateStartEnd } from './startEnd/create-startEnd';

export class CalendarCreateDTO {

    @ApiProperty({
        name: 'open',
        description: 'The date and time that the discussion begins',
        required: true,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public open: string;

    @ApiProperty({
        name: 'close',
        description: 'The date and time that the discussion ends',
        required: true,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public close: Date;

    @ApiProperty({
        name: 'posting',
        description: 'The date and time that the posting time frame begins',
        required: false,
        type: CreateStartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => CreateStartEnd)
    public posting: CreateStartEnd;

    @ApiProperty({
        name: 'responding',
        description: 'The date and time that the responding time frame begins',
        required: false,
        type: CreateStartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => CreateStartEnd)
    public responding: CreateStartEnd
    
    @ApiProperty({
        name: 'synthesizing',
        description: 'The date and time that the synthesizing time frame begins',
        required: false,
        type: CreateStartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => CreateStartEnd)
    public synthesizing?: CreateStartEnd;

    constructor(partial: Partial<CalendarCreateDTO>) {
        Object.assign(this, partial);
    }

}

