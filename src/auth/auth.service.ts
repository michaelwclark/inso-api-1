import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserController } from 'src/modules/user/user.controller';

@Injectable()
export class AuthService {
    constructor(private userController: UserController, private jwtService: JwtService){}

    async validateUser(username: string, password: string): Promise<any>{

        const user = await this.userController.returnUser(username);
        if(!user){
            throw new HttpException('Username does not exist in database', HttpStatus.BAD_REQUEST);
        }

        const bcrypt = require('bcrypt');
        const saltRounds = 10;

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const isMatch = await bcrypt.compare(user.password, hash);

        if(isMatch == true){
            console.log('password validated!');
        }

        return null;
    }

    async login(user: any){
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
