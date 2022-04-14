import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNotEmpty, IsDate } from "class-validator";

export class EditStartEnd {

    @ApiProperty({
        name: 'open',
        description: 'The date and time that the time frame begins',
        required: false,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsOptional()
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
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    close: Date;

    constructor(partial: Partial<EditStartEnd>) {
        Object.assign(this, partial);
    }
}