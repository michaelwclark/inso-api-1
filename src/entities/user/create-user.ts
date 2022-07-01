import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested  } from "class-validator";
import { Contact } from "./user";

export class ContactCreateDTO{

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

    constructor(partial: Partial<ContactCreateDTO>) {
        Object.assign(this, partial);
    }
}

export class UserCreateDTO {

    @ApiProperty({
        name: 'username',
        description: 'String identifier for users',
        required: true,
        type: String,
        isArray: false
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(32)
    public username: string;

    @ApiProperty({
        name: 'f_name',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public f_name: string;

    @ApiProperty({
        name: 'l_name',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public l_name: string;

    @ApiProperty({
        name: 'dateJoined',
        required: false,
        type: Date,
        example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)'
    })
    @IsNotEmpty()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    public dateJoined: Date;

    @ApiProperty({
        name: 'contact',
        required: true,
        type: ContactCreateDTO,
        isArray: true,
        example: [ {
            'email': 'mockemail',
            'verified': true,
            'primary': true
        } ]
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => ContactCreateDTO)
    public contact: ContactCreateDTO[];

    @ApiProperty({
        name: 'sso',
        required: true,
        type: String,
        isArray: true
    })
    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    public sso: string[];

    @ApiProperty({
        name: 'password',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string;

    @ApiProperty({
        name: 'level',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public level: string;

    @ApiProperty({
        name: 'subject',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public subject: string;

    constructor(partial: Partial<UserCreateDTO>) {
        Object.assign(this, partial);
    }
}
