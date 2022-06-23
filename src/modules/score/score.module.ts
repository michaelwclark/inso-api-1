import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user/user';
import { Score, ScoreSchema } from '../../../src/entities/score/score';
import { ScoreController } from './score.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: Score.name, schema: ScoreSchema}]),
            MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [ScoreController],
    providers: [],
})
export class ScoreModule {}
