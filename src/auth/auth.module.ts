import { Module } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [UserModule]
})
export class AuthModule {}
