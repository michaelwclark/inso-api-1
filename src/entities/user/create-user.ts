import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty,
         IsOptional, IsString, MaxLength, MinLength, ValidateNested  } from "class-validator";

export class ContactCreateDTO{

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
        description: 'Boolean to indicate whether or not the given email has been verified',
        required: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    public verified: boolean

    @ApiProperty({
        name: 'primary',
        description: 'Boolean to indicate whether the email is their primary email address, only one can be true',
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
        name: 'f_name',
        description: 'The users first name',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public f_name: string;

    @ApiProperty({
        name: 'l_name',
        description: 'The users last name',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    public l_name: string;

    @ApiProperty({
        name: 'contact',
        description: 'The users list of contact emails',
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
    @ValidateNested({ each: true})
    @Type(() => ContactCreateDTO)
    public contact: ContactCreateDTO[];

    @ApiProperty({
        name: 'password',
        description: 'User authentication key',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    public password: string;

    constructor(partial: Partial<UserCreateDTO>) {
        Object.assign(this, partial);
    }
}
