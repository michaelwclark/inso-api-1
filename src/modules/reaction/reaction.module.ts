import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { Reaction, ReactionSchema } from 'src/entities/reaction/reaction';
import { NotificationModule } from '../notification/notification.module';
import { ReactionController } from './reaction.controller';

@Module({
    imports: [
        AuthModule,
        NotificationModule,
        MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
        MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]),
    ],
    controllers: [ReactionController],
    providers: [],
})
export class ReactionModule {}
