import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';

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

export class CalendarCreateDTO {
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public open: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public close: Date;

    @ValidateNested()
    @Type(() => StartEnd)
    public posting: StartEnd;

    @ValidateNested()
    @Type(() => StartEnd)
    public responding: StartEnd
    
    @ValidateNested()
    @Type(() => StartEnd)
    public synthesizing?: StartEnd;

    constructor(partial: Partial<CalendarCreateDTO>) {
        Object.assign(this, partial);
    }

}

