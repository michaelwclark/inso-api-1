import { Module } from '@nestjs/common';
import { InspirationController } from './inspiration.controller';

@Module({
    imports: [],
    controllers: [InspirationController],
    providers: [],
})
export class InspirationModule {}
