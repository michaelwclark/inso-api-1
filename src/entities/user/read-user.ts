export class UserReadDTO {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
    contact: [
        {
            email: string;
            verified: boolean;
            primary: boolean;
        }
    ];
    level: string;
    subject: string;
}