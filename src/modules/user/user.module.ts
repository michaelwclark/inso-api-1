import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../auth/guards/jwt.strategy';
import { SGService } from '../../drivers/sendgrid';
import { User, UserSchema } from '../../entities/user/user';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '86000s'}
        })
        ],
    controllers: [
        UserController
    ],
    providers: [
        SGService, 
        JwtStrategy
    ],
    exports: []
})
export class UserModule {}
