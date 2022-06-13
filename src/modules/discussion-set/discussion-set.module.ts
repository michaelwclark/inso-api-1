import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionSetController } from './discussion-set.controller';

@Module({
    // TODO Build Schema
    //imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [DiscussionSetController],
    providers: [],
})
export class DiscussionSetModule {}
