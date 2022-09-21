import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested  } from "class-validator";
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
    @IsOptional()
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
    @MinLength(5)
    @MaxLength(32)
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
        name: 'level',
        description: 'The users level of education (student or teaching)',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public level: string;

    @ApiProperty({
        name: 'role',
        description: 'The users role',
        required: true,
        type: String
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public role: string;

    @ApiProperty({
        name: 'profilePicture',
        description: 'The users profile',
        required: true,
        type: String,
        example: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg'
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public profilePicture: string;

    constructor(partial: Partial<UserEditDTO>) {
        Object.assign(this, partial);
    }
}