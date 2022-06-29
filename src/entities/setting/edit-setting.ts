import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class SettingsEditDTO{

//id for settings id
    @IsNotEmpty()
    @Type( () => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
            throw new BadRequestException([ 'Invalid ObjectId for Setting Id']);
        }

        return new Types.ObjectId(id.value);
    })
    public id: Types.ObjectId;

    //starter prompt
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public starter_prompt: string;

    //post inspiration 
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsArray()
    @Transform((id:any) => {    
    const ids = id.value.map(id => {
            if (!Types.ObjectId.isValid(id.value)){
            throw new BadRequestException(['Invalid ObjectId for Post Inspiration Id']);
            }
            return new Types.ObjectId(id.value);
        })
        return ids;
    })
    public post_inspiration: Types.ObjectId [];

    //score
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
            throw new BadRequestException(['Invalid ObjectId for Scores Id']);
        }
        return new Types.ObjectId(id.value);
    })
    public score: Types.ObjectId;

    //calendar
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)){
            throw new BadRequestException(['Invalid ObjectId for Calendar Id']);

        }
        return new Types.ObjectId(id.value);
    })
    public calendar: Types.ObjectId;

    //user id
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)) {
            throw new BadRequestException(['Invale ObjectId for User Id']);
        }
        return new Types.ObjectId(id.value);
    })
    public userId: Types.ObjectId;


    constructor(partial: Partial<SettingsEditDTO>) {
        Object.assign(this, partial);
    }




        
}