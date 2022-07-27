export class NotificationReadDTO {
    _id: string;
    user: {
        "f_name": string,
        "l_name": string,
        "username": string,
        "email": string
    }
    date: Date;
    notificationHeader: string;
    notificationText: string;

    constructor(partial: Partial<NotificationReadDTO>) {
        this._id = partial._id;
        this.user = partial.user;
        this.date = partial.date;
        this.notificationHeader = partial.notificationHeader;
        this.notificationText = partial.notificationText;
    }
}