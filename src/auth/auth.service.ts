import { HttpException, HttpStatus, Injectable, Post, UseGuards, Request, Get, Body, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from 'src/modules/user/user.controller';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { DiscussionController } from 'src/modules/discussion/discussion.controller';
import { InjectModel } from '@nestjs/mongoose';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';

@Injectable()
export class AuthService {
    constructor(
        private userController: UserController, 
        private jwtService: JwtService,
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>, 
        @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
        ){
    }

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.userController.returnUser(email);
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

    // // AUTHORIZATION
    // async validateAuthor(username: string, entity: string, objectId: string ){
        
    //     const author = await this.userController.returnUserByUsername(username);        

    //     const creatorId = await this.findCreator(entity, objectId);

    //     console.log('author: ' + author._id + ', creator: ' + creatorId);
    //     let isAuthor = author._id.toString() === creatorId.toString();
    //     console.log(isAuthor);
    //     if(isAuthor == false){
    //         throw new HttpException('User is not the creator of the object, action is not authorized', HttpStatus.FORBIDDEN);
    //     }
        
    //     return isAuthor;
    // }

    // async findCreator(entity: string, objectId: string){
    //     if(entity === 'discussion'){
    //         // Move this to the auth service
    //         const creatorId = await this.discussionController.getCreator(objectId);
    //         console.log('findCreator authService: ' + creatorId);
    //         return creatorId;
    //     }
    //     if(entity === 'post') {
             
    //     }
    // }

    /** GOOGLE LOGIN */
    googleLogin(req) {
        if (!req.user) {
          return 'No user from google'
        }
    
        return {
          message: 'User information from google',
          user: req.user
        }
      }

      /** AUTHORIZATION FUNCTIONS */

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

    async isDiscussionMember(userId: string, discussionId: string) {
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

    verifyMongoIds(ids: string[]) {
        ids.forEach(id => {
            if(!Types.ObjectId.isValid(id)) {
                throw new HttpException(`${id} is not a valid Mongo Id`, HttpStatus.BAD_REQUEST);
            }
        });
    }
}
