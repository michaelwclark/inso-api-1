import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';

@Module({
    imports: [],
    controllers: [GradeController],
    providers: [],
})
export class GradeModule {}
