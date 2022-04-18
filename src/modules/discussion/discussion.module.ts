import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';

@Module({
    imports: [],
    controllers: [DiscussionController],
    providers: [],
})
export class DiscussionModule {}
