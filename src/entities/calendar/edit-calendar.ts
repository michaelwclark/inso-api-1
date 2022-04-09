import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Types } from 'mongoose';

export class StartEnd {

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    open: Date;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    close: Date;

    constructor(partial: Partial<StartEnd>) {
        Object.assign(this, partial);
    }
}

export class CalendarEditDTO {

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public id: Types.ObjectId;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public open: Date;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public close: Date;

    @IsOptional()
    @ValidateNested()
    @Type(() => StartEnd)
    public posting?: StartEnd;

    @IsOptional()
    @ValidateNested()
    @Type(() => StartEnd)
    public responding?: StartEnd;

    @IsOptional()
    @ValidateNested()
    @Type(() => StartEnd)
    public synthesizing?: StartEnd;

    constructor(partial: Partial<CalendarEditDTO>) {
        Object.assign(this, partial);
    }
}