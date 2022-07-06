import { BadRequestException } from "@nestjs/common";
import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class SettingsEditDTO{

//id for settings id
    @IsNotEmpty()
    @Type( () => Types.ObjectId)
    @IsMongoId()
    public id: Types.ObjectId;

    //starter prompt
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public prompt: string;

    //post inspiration 
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsArray()
    @IsMongoId()
    public post_inspiration: Types.ObjectId [];

    //score
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public score: Types.ObjectId;

    //calendar
    @IsOptional()
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public calendar: Types.ObjectId;

    //user id
    @IsNotEmpty()
    @Type(() => Types.ObjectId)
    @IsMongoId()
    public userId: Types.ObjectId;


    constructor(partial: Partial<SettingsEditDTO>) {
        Object.assign(this, partial);
    }




        
}