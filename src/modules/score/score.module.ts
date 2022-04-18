import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';

@Module({
    imports: [],
    controllers: [ScoreController],
    providers: [],
})
export class ScoreModule {}
