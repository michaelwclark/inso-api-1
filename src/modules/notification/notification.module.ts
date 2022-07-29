import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationSchema, Notification } from 'src/entities/notification/notification';
import { User, UserSchema } from 'src/entities/user/user';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService]
})
export class NotificationModule {}