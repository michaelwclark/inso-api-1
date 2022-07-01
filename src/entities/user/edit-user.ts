import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, ValidateNested  } from "class-validator";
import { Types } from "mongoose";
import { ContactCreateDTO } from "./create-user";

export class ContactEditDTO{

    @ApiProperty({
        name: 'email',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public email: string;

    @ApiProperty({
        name: 'verified',
        required: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    public verified: boolean

    @ApiProperty({
        name: 'primary',
        required: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    public primary: boolean

    constructor(partial: Partial<ContactEditDTO>) {
        Object.assign(this, partial);
    }
}

export class UserEditDTO {

    // @ApiProperty({
    //     name: 'id',
    //     description: 'The ObjectId of the user being edited',
    //     required: true,
    //     type: Types.ObjectId,
    //     isArray: false,
    //     example: '507f1f77bcf86cd799439011'
    // })
    // @IsNotEmpty()
    // @Type(() => Types.ObjectId)
    // @Transform((id:any) => {
    //     if (!Types.ObjectId.isValid(id.value)) {
    //       throw new BadRequestException(['Invalid ObjectId for User Id']);
    //     }
    //     return new Types.ObjectId(id.value);
    // })
    // public id: Types.ObjectId

    @ApiProperty({
        name: 'username',
        description: 'String identifier for users',
        required: true,
        type: String,
        isArray: false
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public username: string;

    @ApiProperty({
        name: 'f_name',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public f_name: string;

    @ApiProperty({
        name: 'l_name',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public l_name: string;

    @ApiProperty({
        name: 'contact',
        required: true,
        type: ContactEditDTO,
        isArray: true,
        example: [ {
            'email': 'mockemail',
            'primary': true
        } ]
    })
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => ContactEditDTO)
    public contact: ContactEditDTO[];

    @ApiProperty({
        name: 'sso',
        required: true,
        type: String,
        isArray: true
    })
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    public sso: string[];

    @ApiProperty({
        name: 'level',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public level: string;

    @ApiProperty({
        name: 'subject',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public subject: string;

    constructor(partial: Partial<UserEditDTO>) {
        Object.assign(this, partial);
    }
}