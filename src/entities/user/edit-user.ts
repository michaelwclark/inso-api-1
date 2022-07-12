import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested  } from "class-validator";
import { Types } from "mongoose";
import { ContactCreateDTO } from "./create-user";

export class ContactEditDTO{

    @ApiProperty({
        name: 'email',
        description: 'The contact email the user would like to register for their account',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsEmail()
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

    @ApiProperty({
        name: 'delete',
        required: false,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    public delete: boolean

    constructor(partial: Partial<ContactEditDTO>) {
        Object.assign(this, partial);
    }
}

export class UserEditDTO {

    @ApiProperty({
        name: 'username',
        description: 'String identifier for users, must be unique',
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
        description: 'The users first name',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public f_name: string;

    @ApiProperty({
        name: 'l_name',
        description: 'The users last name',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public l_name: string;

    @ApiProperty({
        name: 'contact',
        description: 'List of contact emails the user would like to add',
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
    @ValidateNested({each: true})
    @Type(() => ContactEditDTO)
    public contact: ContactEditDTO[];

    @ApiProperty({
        name: 'sso',
        required: true,
        type: String,
        isArray: true
    })
    @IsOptional()
    @IsNotEmpty({each: true})
    @IsArray()
    @ArrayMinSize(1)
    @IsString({each: true})
    public sso: string[];

    @ApiProperty({
        name: 'level',
        description: 'The users level of authorization',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public level: string;

    @ApiProperty({
        name: 'subject',
        description: 'The users class subject',
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