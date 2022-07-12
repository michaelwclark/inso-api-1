import { Contact } from "./user";

export class UserReadDTO {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
    contact: Contact[];
    level: string;
    subject: string;

    constructor(partial: Partial<UserReadDTO>) {
        //Object.assign(this, partial);
        this.id = partial.id;
        this.username = partial.username;
        this.f_name = partial.f_name;
        this.l_name = partial.l_name;
        this.contact = partial.contact;
        this.level = partial.level;
        this.subject = partial.subject;

    }
}