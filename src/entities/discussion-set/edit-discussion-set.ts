import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString, Length } from "class-validator";
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

    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        // Whatever code we decide to go with should be validated here
        return id;
    })
    public insoCode: string;

    @IsString()
    public name: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    public archived: Date;

    @IsArray()
    @Length(1)
    public facilitators: string [];

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