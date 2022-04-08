import { Contact } from "src/entities/user";

export class AuthUser {
    public id: string;
    public username: string;
    public f_name: string;
    public l_name: string;
    public contact: Contact [];
    public sso: string [];

    constructor(partial: Partial<AuthUser>) {
        Object.assign(this, partial);
    }
}
