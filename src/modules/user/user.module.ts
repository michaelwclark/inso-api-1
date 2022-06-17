import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/entities/user/user';
import { CalendarController } from '../calendar/calendar.controller';
import { UserController } from './user.controller';

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [UserController, CalendarController],
    providers: [],
})
export class UserModule {}
