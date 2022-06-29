import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspiration, InspirationSchema } from 'src/entities/inspiration/inspiration';
import { InspirationController } from './inspiration.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Inspiration.name, schema: InspirationSchema }])],
    controllers: [InspirationController],
    providers: [],
})
export class InspirationModule {}
