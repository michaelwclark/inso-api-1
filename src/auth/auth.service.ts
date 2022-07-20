import { HttpException, HttpStatus, Injectable, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from 'src/modules/user/user.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userController: UserController, private jwtService: JwtService){
    }

    async validateUser(email: string, password: string): Promise<any>{
        const user = await this.userController.returnUser(email);
        if(!user){
            throw new HttpException('Username does not exist in database', HttpStatus.BAD_REQUEST);
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

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

}
