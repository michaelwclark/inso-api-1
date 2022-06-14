import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from './discussion.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]), MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [DiscussionController],
    providers: [],
})
export class DiscussionModule {}
