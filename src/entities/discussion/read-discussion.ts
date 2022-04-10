import { BadRequestException } from "@nestjs/common";
import { Type, Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Types } from 'mongoose';

export class Discussion {
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
    public insoCode: string;

    
}