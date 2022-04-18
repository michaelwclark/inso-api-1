import { Module } from '@nestjs/common';
import { ReactionController } from './reaction.controller';

@Module({
    imports: [],
    controllers: [ReactionController],
    providers: [],
})
export class ReactionModule {}
