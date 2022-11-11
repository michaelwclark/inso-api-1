import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ContactCreateDTO } from './create-user';

export class GoogleUserDTO {
  @ApiProperty({
    name: 'f_name',
    description: 'The users first name',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  public f_name: string;

  @ApiProperty({
    name: 'l_name',
    description: 'The users last name',
    required: true,
    type: String,
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
    example: [
      {
        email: 'mockemail',
        verified: true,
        primary: true,
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactCreateDTO)
  public contact: ContactCreateDTO[];

  @ApiProperty({
    name: 'username',
    description: 'String identifier for users, must be unique',
    required: true,
    type: String,
    isArray: false,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(32)
  public username: string;

  constructor(partial: Partial<GoogleUserDTO>) {
    if (partial) {
      this.f_name = partial.f_name;
      this.l_name = partial.l_name;
      this.contact = partial.contact;
      this.username = partial.username;
    }
  }
}
