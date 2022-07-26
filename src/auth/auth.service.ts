import { HttpException, HttpStatus, Injectable, Post, UseGuards, Request, Get, Body, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from 'src/modules/user/user.controller';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { DiscussionController } from 'src/modules/discussion/discussion.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { Calendar, CalendarDocument } from 'src/entities/calendar/calendar';
import { Score, ScoreDocument } from 'src/entities/score/score';
import { User, UserDocument } from 'src/entities/user/user';
import { validatePassword } from 'src/entities/user/commonFunctions/validatePassword';

@Injectable()
export class AuthService {
    constructor(
        private userController: UserController, 
        private jwtService: JwtService,
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>, 
        @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
        @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
        @InjectModel(Calendar.name) private calendarModel: Model<CalendarDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
        ){
    }

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.userModel.findOne({ "contact.email" : email});
        if(!user){
            throw new HttpException('Username does not exist in database', HttpStatus.BAD_REQUEST);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch == false){
            throw new HttpException('Invalid credentials, password is not correct', HttpStatus.BAD_REQUEST);
        }
        
        return this.login(user);
    }

    async login(user: any){
        const payload = { 'username': user.username, 'sub': user._id };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    /** GOOGLE LOGIN */
    async googleLogin(req) {
        if (!req.user) {
          throw new HttpException('User does not exist to Google!', HttpStatus.NOT_FOUND);
        }
    
        // Check out db for the user and see if the email is attached
        const user = await this.userModel.findOne({ "contact.email": req.user.email });
        if(user == null) {
            // Create a user 
            // const new this.userModel({
            //     f_name: req.user.
            // })
        }
        console.log(req.user)
        const payload = { 'username': user.username, 'sub': user._id };
        return {
            access_token: this.jwtService.sign(payload)
        }
            

      }
      /**
       * Reset Password 
       * @param userId 
       * @param oldPassword 
       * @param newPassword 
       * @returns 
       */

      async resetPassword(userId: string, oldPassword: string, newPassword: string) {
        this.verifyMongoIds([userId]);
        const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(isMatch == false){
            throw new HttpException('Invalid credentials, old password is not correct', HttpStatus.BAD_REQUEST);
        }

        validatePassword(newPassword);

        const saltRounds = 10;
        const password = await bcrypt.hash(user.password, saltRounds);

        return await this.userModel.findOneAndUpdate({ _id: user._id}, { password: password });
      }

      /** AUTHORIZATION DECORATOR FUNCTIONS */

    async isDiscussionCreator(userId: string, discussionId: string): Promise<boolean> {
        const isCreator = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId), poster: new Types.ObjectId(userId)}) === null ? false : true;
        if(!isCreator) {
            throw new HttpException(`User: ${userId} is not permitted to perform this action on the discussion`, HttpStatus.FORBIDDEN);
        }
        return isCreator;
    }

    async isDiscussionFacilitator(userId: string, discussionId: string) {
        const isFacilitator = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId), facilitators: new Types.ObjectId(userId)}) === null ? false : true;
        if(!isFacilitator) {
            throw new HttpException(`User: ${userId} is not a facilitator and cannon perform action on the discussion`, HttpStatus.FORBIDDEN);
        }
        return isFacilitator;
    }

    async isDiscussionParticipant(userId: string, discussionId: string) {
        const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId) });
        const participantIds = discussion.participants.map(part => {
            return part.user.toString();
        });
        if(!participantIds.includes(userId)) {
            throw new HttpException(`User: ${userId} is not a participant of the discussion and cannot perform action on the discussion`, HttpStatus.FORBIDDEN);
        }
        return true;
    }

    async isPostCreator(userId: string, postId: string) {
        const isPoster = await this.postModel.findOne({ _id: new Types.ObjectId(postId), userId: new Types.ObjectId(userId) }) === null ? false : true;
        if(!isPoster) {
            throw new HttpException(`User: ${userId} is not the author of the post and cannot perform this action`, HttpStatus.FORBIDDEN);
        }
        return isPoster;
    }

    async isReactionCreator(userId: string, discussionId: string) {
        // TODO When I write reactions logic
        const isReactionCreator = true;
        return isReactionCreator;
    }

    async isDiscussionMember(userId: string, discussionId: string): Promise<boolean> {
        const isFacilitator = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId), facilitators: new Types.ObjectId(userId)}) === null ? false : true;
        const discussion = await this.discussionModel.findOne({ _id: new Types.ObjectId(discussionId) });
        const participantIds = discussion.participants.map(part => {
            return part.user.toString();
        });
        const isParticipant = participantIds.includes(userId);

        if(!isFacilitator && !isParticipant) {
            throw new HttpException(`${userId} is not a member of this discussion`, HttpStatus.FORBIDDEN);
        }
        return isFacilitator || isParticipant;
    }

    async isScoreCreator(userId: string, scoreId: string): Promise<boolean> {
        const isScorer = await this.scoreModel.findOne({ _id: new Types.ObjectId(scoreId), creatorId: new Types.ObjectId(userId) }) === null ? false : true;
        if(!isScorer) {
            throw new HttpException(`${userId} is not permitted to perform action on the score`, HttpStatus.FORBIDDEN);
        }
        return isScorer;
    }

    async isCalendarCreator(userId: string, calendarId: string): Promise<boolean> {
        const isCalendarCreator = await this.calendarModel.findOne( { _id: new Types.ObjectId(calendarId), creator: new Types.ObjectId(userId)}) === null ? false : true;
        if(!isCalendarCreator) {
            throw new HttpException(`${userId} is not permitted to perform action on the calendar`, HttpStatus.FORBIDDEN);
        }
        return isCalendarCreator;
    }

    //** MONGO ID VERIFICATION */
    verifyMongoIds(ids: string[]) {
        ids.forEach(id => {
            if(!Types.ObjectId.isValid(id)) {
                throw new HttpException(`${id} is not a valid Mongo Id`, HttpStatus.BAD_REQUEST);
            }
        });
    }
}
