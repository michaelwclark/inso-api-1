import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString, Length } from "class-validator";

export class PasswordResetDTO{

    @ApiProperty({
        name: 'oldPassword',
        description: 'The old password for the user',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @Length(8)
    @IsDefined()
    public oldPassword: string;

    @ApiProperty({
        name: 'newPassword',
        description: 'The new password for the user',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @Length(8)
    @IsDefined()
    public newPassword: string;

    constructor(partial: Partial<PasswordResetDTO>) {
        if(partial) {
            this.oldPassword = partial.oldPassword;
            this.newPassword = partial.newPassword;
        }
    }

}

export class EmailPasswordResetDTO{
    @ApiProperty({
        name: 'password',
        description: 'The new password for the user',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @Length(8)
    @IsDefined()
    public password: string;

    constructor(partial: Partial<EmailPasswordResetDTO>) {
        if(partial) {
            this.password = partial.password;
        }
    }
}