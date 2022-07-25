import { IsDefined, IsString } from "class-validator";


export class UpdateReactionDTO {
    @IsDefined()
    @IsString()
    reaction: string;

    constructor(partial: Partial<UpdateReactionDTO>) {
        if(partial) {
            this.reaction = partial.reaction;
        }
    }
}