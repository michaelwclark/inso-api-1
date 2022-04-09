import { BadRequestException } from "@nestjs/common/exceptions";
import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Types } from 'mongoose';

export class DiscussionSetCreateDTO {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    @IsArray()
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for facilitator']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public facilitators: Types.ObjectId [];

    @IsNotEmpty()
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
          throw new BadRequestException(['Invalid ObjectId for Poster']);
        }
    
        return new Types.ObjectId(id.value);
    })
    public poster: Types.ObjectId;
    
    constructor(partial: Partial<DiscussionSetCreateDTO>) {
        Object.assign(this, partial);
    }
}