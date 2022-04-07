export class Contact {
    email: string;
    verified: boolean;
    primary: boolean;
}
export class User {
    public id: string;
    public username: string;
    public f_name: string;
    public l_name: string;
    public dateJoined: Date;
    public contact: Contact [];
    public sso: string [];
    public password: string;
    public level: string;
    public subject: string;
    
    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
