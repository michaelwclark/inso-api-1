import { Module } from '@nestjs/common';
import { DiscussionSetController } from './discussion-set.controller';

@Module({
    imports: [],
    controllers: [DiscussionSetController],
    providers: [],
})
export class DiscussionSetModule {}
