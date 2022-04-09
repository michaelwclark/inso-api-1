import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class DiscussionEditDTO {
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
    @IsString()
    public name: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public archived: Date;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public settings: Types.ObjectId;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public facilitators: Types.ObjectId [];

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public poster: Types.ObjectId;
    
    constructor(partial: Partial<DiscussionEditDTO>) {
        Object.assign(this, partial);
    }
}