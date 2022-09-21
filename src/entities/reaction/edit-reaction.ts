import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";


export class UpdateReactionDTO {

    @ApiProperty({
        name: 'reaction',
        description: 'The emoji code for the reaction',
        required: false,
        type: String,
        isArray: false,
        example: '+1'
    })
    @IsDefined()
    @IsString()
    reaction: string;

    constructor(partial: Partial<UpdateReactionDTO>) {
        if(partial) {
            this.reaction = partial.reaction;
        }
    }
}