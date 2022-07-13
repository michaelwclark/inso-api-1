import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserController } from 'src/modules/user/user.controller';

@Injectable()
export class AuthService {
    constructor(private userController: UserController){}

    async validateUser(username: string, password: string): Promise<any>{

        const user = await this.userController.returnUser(username);
        if(!user){
            throw new HttpException('Username does not exist in database', HttpStatus.BAD_REQUEST);
        }

        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        //let hashed: string;

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
    
        // bcrypt.genSalt(saltRounds, function(err, salt){
        //     bcrypt.hash(password, salt, function(err, hash){
        //       hashed = hash
        //     })
        // })

        const isMatch = await bcrypt.compare(user.password, hash);

        // bcrypt.compare(user.password, hashed, function(err, result){
        //     if (err) {
        //         console.error(err)
        //     }
        //     if(result == true){
        //         console.log('password validated!');
        //     }
        // })

        if(isMatch == true){
            console.log('password validated!');
        }

        // if(user.password === password){
        //     const { password, ...result } = user;
        //     return result;
        // }

        return null;
    }
}
