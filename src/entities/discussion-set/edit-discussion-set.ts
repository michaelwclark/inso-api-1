import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Types } from 'mongoose';

export class DiscussionSetEditDTO {
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
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        // Whatever code we decide to go with should be validated here
        return id;
    })
    public insoCode: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsOptional()
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public archived: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    public facilitators: string [];

    @IsOptional()
    @IsNotEmpty()
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Calendar Id']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public poster: Types.ObjectId;
    
    constructor(partial: Partial<DiscussionSetEditDTO>) {
        Object.assign(this, partial);
    }
}