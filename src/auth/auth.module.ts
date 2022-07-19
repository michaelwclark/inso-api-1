import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/entities/user/user';
import { UserController } from 'src/modules/user/user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from '../auth.controller';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule, 
    PassportModule, 
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '86000s'}
     })], 
  controllers: [],
  exports: [AuthService]
})
export class AuthModule {}
