import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "src/entities/notification/notification";
import { User, UserDocument } from "src/entities/user/user";

@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(Notification.name) private settingsModel: Model<NotificationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}
    /**
     * This function will create a notification for a user
     * @param userId 
     * @param notification 
     */
    async createNotification(userId: string, notification: { header: string, text: string }) {
        
    }

    async deleteNotification() {

    }

    async getNotifications() {

    }
}