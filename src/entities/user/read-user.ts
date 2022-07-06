import { Contact } from "./user";

export class UserReadDTO {
    id: string;
    username: string;
    f_name: string;
    l_name: string;
    // contact: [
    //     {
    //         email: string;
    //         verified: boolean;
    //         primary: boolean;
    //     }
    // ];
    contact: Contact[];
    level: string;
    subject: string;
}