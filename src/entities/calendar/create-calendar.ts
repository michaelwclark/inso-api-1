import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartEnd {
    @ApiProperty({
        name: 'open',
        description: 'The date and time that the time frame begins',
        required: false,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    open: Date;


    @ApiProperty({
        name: 'close',
        description: 'The date and time that the time frame ends',
        required: false,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    close: Date;

    constructor(partial: Partial<StartEnd>) {
        Object.assign(this, partial);
    }
}

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
        type: StartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => StartEnd)
    public posting: StartEnd;

    @ApiProperty({
        name: 'responding',
        description: 'The date and time that the responding time frame begins',
        required: false,
        type: StartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => StartEnd)
    public responding: StartEnd
    
    @ApiProperty({
        name: 'synthesizing',
        description: 'The date and time that the synthesizing time frame begins',
        required: false,
        type: StartEnd,
        isArray: false
    })
    @ValidateNested()
    @Type(() => StartEnd)
    public synthesizing?: StartEnd;

    constructor(partial: Partial<CalendarCreateDTO>) {
        Object.assign(this, partial);
    }

}

