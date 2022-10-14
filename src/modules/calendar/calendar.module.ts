import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user/user';
import { Calendar, CalendarSchema } from 'src/entities/calendar/calendar';
import { CalendarController } from './calendar.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CalendarController],
  providers: [],
})
export class CalendarModule {}
