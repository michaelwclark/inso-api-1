import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema, Notification } from 'src/entities/notification/notification';
import { User, UserSchema } from 'src/entities/user/user';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}