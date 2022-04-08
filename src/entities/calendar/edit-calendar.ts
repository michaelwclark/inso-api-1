import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";
import { Types } from 'mongoose';

export class StartEnd {
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    open: Date;

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
    public id: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public open: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public close: Date;

    @ValidateNested()
    @Type(() => StartEnd)
    public posting?: StartEnd;

    @ValidateNested()
    @Type(() => StartEnd)
    public responding?: StartEnd;

    @ValidateNested()
    @Type(() => StartEnd)
    public synthesizing?: StartEnd;

    constructor(partial: Partial<CalendarEditDTO>) {
        Object.assign(this, partial);
    }
}