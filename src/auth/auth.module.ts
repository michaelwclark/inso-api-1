import { Module, forwardRef } from '@nestjs/common';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from '../entities/user/user';
import { UserModule } from '../modules/user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/local.strategy';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { GoogleAuthController } from './googleAuth.controller';
import { Discussion, DiscussionSchema } from '../entities/discussion/discussion';
import { DiscussionPost, DiscussionPostSchema } from '../entities/post/post';
import { Score, ScoreSchema } from '../entities/score/score';
import { Calendar, CalendarSchema } from '../entities/calendar/calendar';
import { SGService } from '../drivers/sendgrid';
import { Reaction, ReactionSchema } from '../entities/reaction/reaction';
import { MilestoneModule } from '../modules/milestone/milestone.module';

@Module({
  providers: [AuthService, LocalStrategy, JwtStrategy, SGService],
  imports: [
    UserModule,
    SGService,
    forwardRef(() => MilestoneModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '86000s'}
     }),
     MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
     MongooseModule.forFeature([{ name: DiscussionPost.name, schema: DiscussionPostSchema }]),
     MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
     MongooseModule.forFeature([{ name: Calendar.name, schema: CalendarSchema }]),
     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
     MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }])
    ], 
  controllers: [AuthController, GoogleAuthController],
  exports: [AuthService]
})
export class AuthModule {}
