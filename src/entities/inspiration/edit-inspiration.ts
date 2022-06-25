import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

export class OutlineEditDTO {
    @ApiProperty({
        name: 'header',
        description: 'The header for the part of the outline',
        required: true,
        type: String,
        isArray: false,
        example: 'Outline try 1s'
    })
    @IsNotEmpty()
    @IsString()
    public header: string;

    @ApiProperty({
        name: 'header',
        description: 'The header for the part of the outline',
        required: true,
        type: String,
        isArray: false,
        example: 'Outline try 1s'
    })
    @IsNotEmpty()
    @IsString()
    public prompt: string;

    constructor(partial: Partial<OutlineEditDTO>) {
        Object.assign(this, partial);
    }
}

export class InspirationEditDTO {
    @ApiProperty({
        name: 'id',
        description: 'The id of the post inspiration',
        required: true,
        type: String,
        isArray: false,
        example: 'valid mongo id'
    })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    public id: Types.ObjectId;

    @ApiProperty({
        name: 'name',
        description: 'The name of the inspiration',
        required: true,
        type: String,
        isArray: false,
        example: 'poll'
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public name: string;

    @ApiProperty({
        name: 'instructions',
        description: 'The instructions for the post inspiration',
        required: true,
        type: String,
        isArray: false,
        example: 'Create a poll for your class'
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public instructions: string;

    @ApiProperty({
        name: 'outline',
        description: 'The outline array for the discussion inspiration',
        required: true,
        type: [OutlineEditDTO],
        isArray: false,
        example: 'Create a poll for your class'
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => OutlineEditDTO)
    public outline: OutlineEditDTO[];

    constructor(partial: Partial<InspirationEditDTO>) {
        Object.assign(this, partial);
    }
}