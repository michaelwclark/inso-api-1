import { Module, forwardRef, Post } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/entities/user/user';
import { UserController } from 'src/modules/user/user.controller';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { DiscussionModule } from 'src/modules/discussion/discussion.module';
import { GoogleAuthController } from './googleAuth.controller';
import { Discussion, DiscussionSchema } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from 'src/entities/post/post';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UserModule, 
    forwardRef(() => DiscussionModule),
    PassportModule, 
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86000s'}
     }),
     MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
     MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }])
    ], 
  controllers: [AuthController, GoogleAuthController],
  exports: [AuthService]
})
export class AuthModule {}
