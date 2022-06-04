import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: '', schema: '' }])],
    controllers: [PostController],
    providers: [],
})
export class PostModule {}
