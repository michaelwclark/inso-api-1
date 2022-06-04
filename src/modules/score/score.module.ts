import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreController } from './score.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [ScoreController],
    providers: [],
})
export class ScoreModule {}
