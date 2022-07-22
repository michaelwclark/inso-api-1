import { HttpException, HttpStatus, Injectable, Post, UseGuards, Request, Get, Body, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from 'src/modules/user/user.controller';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { DiscussionController } from 'src/modules/discussion/discussion.controller';

@Injectable()
export class AuthService {
    constructor(
        private userController: UserController, 
        @Inject(forwardRef(() => DiscussionController))
        private discussionController: DiscussionController,
        private jwtService: JwtService        
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
        } else {
            console.log('user validated!');
        }
        
        return this.login(user);
    }

    async login(user: any){
        const payload = { 'username': user.username, 'sub': user.userId };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    // AUTHORIZATION
    async validateAuthor(username: string, entity: string, objectId: string ){
        
        const author = await this.userController.returnUserByUsername(username);        

        const creatorId = await this.findCreator(entity, objectId);

        console.log('author: ' + author._id + ', creator: ' + creatorId);
        let isAuthor = author._id.toString() === creatorId.toString();
        console.log(isAuthor);
        if(isAuthor == false){
            throw new HttpException('User is not the creator of the object, action is not authorized', HttpStatus.FORBIDDEN);
        }
        
        return isAuthor;
    }

    async findCreator(entity: string, objectId: string){
        if(entity === 'discussion'){
            const creatorId = await this.discussionController.getCreator(objectId);
            console.log('findCreator authService: ' + creatorId);
            return creatorId;
        } 
    }
}
