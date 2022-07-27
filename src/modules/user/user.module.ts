import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { SGService } from 'src/drivers/sendgrid';
import { User, UserSchema } from 'src/entities/user/user';
import { DiscussionModule } from '../discussion/discussion.module';
import { UserController } from './user.controller';

@Module({
    imports: [ AuthService, SGService, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [],
    exports: []
})
export class UserModule {}
