import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Types } from 'mongoose';
import { EditStartEnd } from "./startEnd/edit-startEnd";

export class CalendarEditDTO {
    @ApiProperty({
        name: 'id',
        description: 'The ObjectId of the calendar entity being edited',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public id: Types.ObjectId;

    @ApiProperty({
        name: 'open',
        description: 'The date and time that the discussion starts',
        required: false,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public open: Date;

    @ApiProperty({
        name: 'close',
        description: 'The date and time that the discussion ends',
        required: false,
        type: Date,
        isArray: false,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public close: Date;

    @ApiProperty({
        name: 'posting',
        description: 'The date and time that the discussion posting period starts and ends',
        required: false,
        type: EditStartEnd,
        isArray: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => EditStartEnd)
    public posting?: EditStartEnd;

    @ApiProperty({
        name: 'responding',
        description: 'The date and time that the discussion responding period starts and ends',
        required: false,
        type: EditStartEnd,
        isArray: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => EditStartEnd)
    public responding?: EditStartEnd;

    @ApiProperty({
        name: 'synthesizing',
        description: 'The date and time that the discussion synthesizing period starts and ends',
        required: false,
        type: EditStartEnd,
        isArray: false
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => EditStartEnd)
    public synthesizing?: EditStartEnd;

    @ApiProperty({
        name: 'creatorId',
        description: 'The ObjectId of the user editing the calendar',
        required: true,
        type: Types.ObjectId,
        isArray: false,
        example: '507f1f77bcf86cd799439011'
    })
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((creatorId:any) => {
        if (!Types.ObjectId.isValid(creatorId.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(creatorId.value);
    })
    public creatorId: Types.ObjectId;

    constructor(partial: Partial<CalendarEditDTO>) {
        Object.assign(this, partial);
    }

    
}