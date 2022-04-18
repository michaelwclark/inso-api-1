import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';

@Module({
    imports: [],
    controllers: [CalendarController],
    providers: [],
})
export class CalendarModule {}
