import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Score, ScoreSchema } from '../../../src/entities/score/score';
import { ScoreController } from './score.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: Score.name, schema: ScoreSchema}])],
    controllers: [ScoreController],
    providers: [],
})
export class ScoreModule {}
