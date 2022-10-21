import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationSchema,
  Notification,
} from 'src/entities/notification/notification';
import { Milestone, MilestoneSchema } from '../../entities/milestone/milestone';
import { User, UserSchema } from '../../entities/user/user';
import { NotificationService } from '../notification/notification.service';
import { MilestoneService } from './milestone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [],
  providers: [MilestoneService, NotificationService],
  exports: [MilestoneService],
})
export class MilestoneModule {}
