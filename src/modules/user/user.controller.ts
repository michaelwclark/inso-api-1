import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';



@Controller()
export class UserController {
  constructor() {}
//@InjectModel(User.name) private userModel: Model<UserDocument>   for constructor

  @Get('user')
  getHello(): string {
    return 'user'
  }
}

