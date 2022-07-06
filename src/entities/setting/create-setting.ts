import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { Score } from "../score/score";

export class SettingsCreateDTO {

    //starter prompt 
    @IsNotEmpty()
    @IsString()
    @Length(2, 1000)
    public prompt: string;

    //post inspiration 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsArray()
    @IsMongoId({ each: true })
    public post_inspiration: Types.ObjectId[];

    //score id 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public score: Types.ObjectId;

    //calendar id 
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public calendar: Types.ObjectId;

    constructor(partial: Partial<SettingsCreateDTO>){
        Object.assign(this, partial);
    }

    
}