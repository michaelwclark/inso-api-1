import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from '../../entities/notification/notification';
import { NotificationReadDTO } from '../../entities/notification/read-notification';
// import { User, UserDocument } from '../../entities/user/user';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  /**
   * This function will create a notification for a user
   * @param userId
   * @param notification
   */
  async createNotification(
    userId: any,
    notificationUser: any,
    notification: { header: string; text: string; type: string },
  ) {
    const newNotification = new this.notificationModel({
      ...notification,
      userId,
      notificationUser,
      date: new Date(),
    });
    console.log('no', newNotification);
    return newNotification.save();
  }

  async markNotificationAsRead(notificationId: Types.ObjectId) {
    return await this.notificationModel.findOneAndUpdate(
      { _id: notificationId },
      { read: true },
    );
  }

  async getNotifications(userId: Types.ObjectId) {
    const notifications = await this.notificationModel
      .find({ userId: userId, read: false })
      .sort({ date: -1 })
      .populate('userId', [
        'f_name',
        'l_name',
        'contact.email',
        'username',
        'profilePicture',
      ])
      .populate('notificationUser', [
        'f_name',
        'l_name',
        'contact.email',
        'username',
        'profilePicture',
      ]);
    return await notifications.map((notification) => {
      console.log(notification);
      return new NotificationReadDTO(notification);
    });
  }

  async deleteNotification(notificationId: Types.ObjectId) {
    return await this.notificationModel.findOneAndDelete({
      _id: notificationId,
    });
  }
}
