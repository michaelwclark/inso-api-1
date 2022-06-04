import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [UserController],
    providers: [],
})
export class UserModule {}
