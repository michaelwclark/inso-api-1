import { Contact } from "./user";
import { plainToClass } from "class-transformer";

export class UserReadDTO {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
    contact: {
        'email': string,
        'verified': boolean,
        'primary': boolean
        }[];
    level: string;
    subject: string;

    constructor(partial: Partial<UserReadDTO>) {
        Object.assign(this, partial);
    }
}