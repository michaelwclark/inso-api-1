import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Discussion,
  DiscussionSchema,
} from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';
import { User, UserSchema } from 'src/entities/user/user';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
    MongooseModule.forFeature([
      { name: DiscussionPost.name, schema: DiscussionPostSchema },
    ]),
  ],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
