import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { Score, ScoreSchema } from 'src/entities/score/score';
import { Setting, SettingSchema } from 'src/entities/setting/setting';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionController } from './discussion.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
        MongooseModule.forFeature([{name: Setting.name, schema: SettingSchema}]),
        MongooseModule.forFeature([{ name: Inspiration.name, schema: InspirationSchema}]),
        MongooseModule.forFeature([{name: Score.name, schema: ScoreSchema}]),
        MongooseModule.forFeature([{ name: Calendar.name, schema: CalendarSchema}]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Calendar.name, schema: CalendarSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
    ],
    controllers: [DiscussionController],
    providers: [],
})
export class DiscussionModule {}


