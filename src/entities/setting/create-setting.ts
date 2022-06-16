import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { Score } from "../score/score";

export class SettingsCreateDTO {

    //id


    //starter prompt 
    @IsNotEmpty()
    @IsString()
    public starter_prompt: string;

    //post inspiration 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)){
            throw new BadRequestException (['Invalid ObjectId for Post Inspiration Id ']);
        }

        return new Types.ObjectId(id.value)
    })
    public post_inspiration: Types.ObjectId [];

    //score id 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)){
            throw new BadRequestException(['Invalid ObjectId for Score Id']);
        }

        return new Types.ObjectId(id.value)
    })
    public scores: Types.ObjectId;

    //calendar id 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @Transform((id:any) => {
        if (!Types.ObjectId.isValid(id.value)){
            throw new BadRequestException(['Invalid ObjectId for Calendar Id'])
        }

        return new Types.ObjectId(id.value);
    })
    public calendar: Types.ObjectId;

    constructor(partial: Partial<SettingsCreateDTO>){
        Object.assign(this, partial);
    }

    
}