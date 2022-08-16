import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from 'src/entities/milestone/milestone';
import { User, UserSchema } from 'src/entities/user/user';
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