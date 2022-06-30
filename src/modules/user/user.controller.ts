import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { UserCreateDTO } from 'src/entities/user/create-user';
import { UserEditDTO } from 'src/entities/user/edit-user';
import { User, UserDocument } from 'src/entities/user/user';



@Controller()
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}


  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    
    const foundUser = await this.userModel.findOne({_id: userId});
    if(!foundUser){
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    const returnUser = {
      'first name': foundUser.f_name,
      'last name': foundUser.l_name,
      'username': foundUser.username,
      'contact': foundUser.contact,
      'level': foundUser.level,
      'subject': foundUser.subject
    }

    return returnUser;
  }

  @HttpCode(200)
  @Post('user')
  @ApiOperation({description: 'Request will create a new user'})
  @ApiBody({description: '', type: UserCreateDTO})
  @ApiOkResponse({description: 'User created successfully'})
  @ApiTags('User')
  async createUser(@Body() user: UserCreateDTO){

    var Filter = require('bad-words'),
    filter = new Filter();

    // var test = filter.clean("Dont be an asshole");
    // if (test.includes('*')){
    //   console.log('this has a bad word');
    // } else {
    //   console.log("this was clean");
    // }

    if(user.username.length < 5 || user.username.length > 32){
      throw new HttpException('Username length must be at least 5 characters and no more than 32', HttpStatus.BAD_REQUEST);
    }
    var badUsernameCheck = filter.clean(user.username);
    if(badUsernameCheck.includes('*')){
      throw new HttpException('Username cannot contain obscene or profain language', HttpStatus.BAD_REQUEST);
    }
    const SameUsername = await this.userModel.findOne({username: user.username})
    if(!(SameUsername == undefined)){
      throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
    }
    
    ValidatePassword(user.password);

    const newUser = new this.userModel({...user})
    await newUser.save()

    return 'User Created!';
  }

  @Patch('user/:userId')
  @ApiOperation({description: 'Update a user entity'})
  @ApiBody({description: '', type: UserEditDTO})
  @ApiOkResponse({ description: 'User edited!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  async updateUser(@Param('userId') userId: string, @Body() user: UserEditDTO){

    const foundUser = await this.userModel.findOne({_id: userId});
    if(!foundUser){
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    var Filter = require('bad-words'),
    filter = new Filter();

    if(user.hasOwnProperty('username')){
      if(user.username.length < 5 || user.username.length > 32){
        throw new HttpException('Username length must be at least 5 characters and no more than 32', HttpStatus.BAD_REQUEST);
      }
      const SameUsername = await this.userModel.findOne({username: user.username})
      if(!(SameUsername == undefined)){
        throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
      }
      var badUsernameCheck = filter.clean(user.username);
      if(badUsernameCheck.includes('*')){
        throw new HttpException('Username cannot contain obscene or profain language', HttpStatus.BAD_REQUEST);
      }
    }

    const res = await foundUser.updateOne(user);

    return 'User Updated';
  }
}

function ValidatePassword( password: string){

  if(password.length < 8 || password.length > 32){
    throw new HttpException('Password length must be at least 8 characters and no more than 32', HttpStatus.BAD_REQUEST);
  }

  var hasLowercaseCheck = false;
  var hasUppercaseCheck = false;
  var hasNumberCheck = false;
  var hasSpecialCharCheck = false;
  var specialCharArr = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

  var i = 0;
  var character = '';
  while( i < password.length && hasLowercaseCheck == false  ){ 
    character = password.charAt(i);
    if(isNaN(Number(character.toString()))){
      if(character === character.toLowerCase()){
        hasLowercaseCheck = true;
      } 
    }
    i++;
  }

  i = 0;
  while( i < password.length && hasUppercaseCheck == false  ){ 
    character = password.charAt(i);
    if(isNaN(Number(character.toString()))){
      if(character === character.toUpperCase()){
        hasUppercaseCheck = true;
      } 
    }
    i++;
  }

  i = 0;
  while( i < password.length && hasNumberCheck == false  ){ // && numberCheck == true && lowercaseCheck == true && uppercaseCheck == true
    character = password.charAt(i);
    if(!(isNaN(Number(character.toString())))){
      hasNumberCheck = true;
    }
    i++;
  }

  i = 0;
  while( i < password.length && hasSpecialCharCheck == false  ){ 
    character = password.charAt(i);
    if(isNaN(Number(character.toString()))){
      for(var _i = 0; _i < specialCharArr.length; _i++){
        if(character === specialCharArr[_i]){
          hasSpecialCharCheck = true;
        } 
      }
    }
    i++;
  }

  if(hasLowercaseCheck == false){
    throw new HttpException('Password must contain at least one lowercase character', HttpStatus.BAD_REQUEST);
  }

  if(hasUppercaseCheck == false){
    throw new HttpException('Password must contain at least one uppercase character', HttpStatus.BAD_REQUEST);
  }

  if(hasNumberCheck == false){
    throw new HttpException('Password must contain at least one number', HttpStatus.BAD_REQUEST);
  }

  if(hasSpecialCharCheck == false){
    throw new HttpException('Password must contain at least one special character', HttpStatus.BAD_REQUEST);
  }
}