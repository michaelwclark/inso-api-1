import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user/user';
import { Calendar, CalendarSchema } from '../../entities/calendar/calendar';
import { CalendarController } from './calendar.controller';


@Module({
    imports: [MongooseModule.forFeature([{name: Calendar.name, schema: CalendarSchema}]),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [CalendarController],
    providers: [],
})
export class CalendarModule {}
