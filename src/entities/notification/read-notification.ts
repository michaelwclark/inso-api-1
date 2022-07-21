export class NotificationReadDTO {
    _id: string;
    userId: string;
    date: Date;
    notificationHeader: string;
    notificationText: string;

    constructor(partial: Partial<NotificationReadDTO>) {
        this._id = partial._id;
        this.userId = partial.userId;
        this.date = partial.date;
        this.notificationHeader = partial.notificationHeader;
        this.notificationText = partial.notificationText;
    }
}