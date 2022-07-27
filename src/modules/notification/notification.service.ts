import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Notification, NotificationDocument } from "src/entities/notification/notification";
import { User, UserDocument } from "src/entities/user/user";

@Injectable()
export class NotificationService {

    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}
    /**
     * This function will create a notification for a user
     * @param userId 
     * @param notification 
     */
    async createNotification(userId: any, notification: { header: string, text: string }) {
        const newNotification = new this.notificationModel({ ...notification, userId, date: new Date()});
        return newNotification.save();
    }

    async markNotificationAsRead(notificationId: Types.ObjectId) {
        
    }

    async deleteNotification(notificationId: Types.ObjectId) {

    }

    async getNotifications(userId: Types.ObjectId) {
        return this.notificationModel.find({ userId: userId}).sort({ date: -1});
    }
}