import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from '../../entities/milestone/milestone';
import { User, UserSchema } from '../../entities/user/user';
import { NotificationModule } from '../notification/notification.module';
import { MilestoneService } from './milestone.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Milestone.name, schema: MilestoneSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
    ],
    controllers: [],
    providers: [MilestoneService],
    exports: [MilestoneService]
})
export class MilestoneModule {}