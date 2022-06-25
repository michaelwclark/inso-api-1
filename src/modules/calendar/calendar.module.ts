import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { CalendarController } from './calendar.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: Calendar.name, schema: CalendarSchema}])],
    controllers: [CalendarController],
    providers: [],
})
export class CalendarModule {}
