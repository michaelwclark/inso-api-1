import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Milestone,
  MilestoneDocument,
} from '../../entities/milestone/milestone';
// import { User, UserDocument } from '../../entities/user/user';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MilestoneService {
  public validTypes = ['system achievement', 'system progress', 'recognition'];
  public validSystemAchievements = [
    '1st Post', // Done
    'Use a Post Inspiration', // Done
    'Comment Received on Post', // Done
    '1st Upvote', // Done
    'Perfect Score',
    'Discussion Created', // Done
  ];
  constructor(
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {}

  async createMilestoneForUser(
    userId: Types.ObjectId,
    type: string,
    milestoneName: string,
    info: { discussionId: Types.ObjectId; postId: Types.ObjectId; date },
  ) {
    if (!this.validSystemAchievements.includes(milestoneName)) {
      throw new Error('Not a valid milestone name');
    }
    const milestone = new this.milestoneModel({
      userId: userId,
      type: type,
      date: new Date(),
      milestone: milestoneName,
      info: info,
    });
    const savedMilestone = await milestone.save();
    await this.notificationService.createNotification(userId, userId, {
      header: `<h1 className="notification-header">You have achieved a badge!"</h1>`,
      text: `${milestoneName}`,
      type: 'badge',
    });
    return savedMilestone;
  }

  /**
   * This function is to check for the progress of a milestone
   * @param userId
   * @returns
   */
  // async checkUserMilestoneProgress(userId: Types.ObjectId) {
  //     // Check what progress milestones the user has achieved
  //     const milestones = await this.milestoneModel.find({userId: userId});

  //     // See if they have achieved any new ones
  //     const newMilestones = [];
  //     milestones.forEach(milestone => {
  //         console.log(milestone);
  //     })
  //     // Add those to the database if they have
  //     for await(let newMilestone of newMilestones) {
  //         //this.createMilestoneForUser(userId, newMilestone.type, newMilestone.milestone, )
  //         const milestone = new this.milestoneModel({
  //             userId: userId,
  //             type: newMilestone.type,
  //             date: new Date(),
  //             milestone: newMilestone.milestone,
  //             info: newMilestone.info
  //         });
  //         return await milestone.save();
  //     }
  // }

  async getMilestonesForUser(userId: Types.ObjectId) {
    return await this.milestoneModel.find({ userId: userId });
  }

  async getMilestoneForUser(userId: Types.ObjectId, milestoneName: string) {
    return await this.milestoneModel.findOne({
      userId: userId,
      milestone: milestoneName,
    });
  }
}
