import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionController } from './reaction.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [ReactionController],
    providers: [],
})
export class ReactionModule {}
