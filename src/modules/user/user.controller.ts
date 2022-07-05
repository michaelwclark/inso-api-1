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

    ValidateUsername(user.username);
    
    const SameUsername = await this.userModel.findOne({username: user.username})
    if(!(SameUsername == undefined)){
      throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
    }
    
    for(var i = 0; i < user.contact.length; i++){
      for(var j = i + 1; j < user.contact.length; j++){
        if(user.contact[i].email === user.contact[j].email){
          throw new HttpException('Cannot have duplicate emails in array', HttpStatus.BAD_REQUEST);
        }
      }
    }

    for(var i = 0; i < user.contact.length; i++){
      if(i == 0){
        user.contact[i] = {
          'email': user.contact[i].email,
          'verified': false,
          'primary': true
        }
      } else {
        user.contact[i] = {
          'email': user.contact[i].email,
          'verified': false,
          'primary': false
        }                     // Sets first contact as primary, all others are false, all are not verified
      }
      if(isEmail(user.contact[i].email) == false ){
        throw new HttpException('Email: ' + user.contact[i].email + ', is not a valid email address', HttpStatus.BAD_REQUEST);
      }
      const sameEmail = await this.userModel.findOne({'contact.email': user.contact[i].email})
      if(sameEmail != undefined){
        throw new HttpException('Email ' + user.contact[i].email + ' already is associated with an account', HttpStatus.BAD_REQUEST);
      }
    }


    ValidatePassword(user.password);

    user.dateJoined = new Date(); // Date Joined is always the current date when user is created

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

    if(user.hasOwnProperty('username')){
      ValidateUsername(user.username);
      var previousUsername = foundUser.username; 
      const SameUsername = await this.userModel.findOne({username: user.username})
      if(!(SameUsername == undefined) && (!(SameUsername.username === previousUsername))){
        throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
      } // Will allow if username is property but there is no change in value of username
    }

    if(user.hasOwnProperty('contact')){

      for(var i = 0; i < user.contact.length; i++){
        for(var j = i + 1; j < user.contact.length; j++){
          if(user.contact[i].email === user.contact[j].email){
            throw new HttpException('Cannot have duplicate emails in array', HttpStatus.BAD_REQUEST);
          }
        }
      }

      for(var i = 0; i < user.contact.length; i++){
        user.contact[i] = {
          'email': user.contact[i].email,
          'verified': false,
          'primary': user.contact[i].primary
        }
        if(isEmail(user.contact[i].email) == false ){
          throw new HttpException('Email: ' + user.contact[i].email + ', is not a valid email address', HttpStatus.BAD_REQUEST);
        }
        const sameEmail = await this.userModel.findOne({'contact.email': user.contact[i].email})
        if(sameEmail != undefined){
          throw new HttpException('Email ' + user.contact[i].email + ' already is associated with an account', HttpStatus.BAD_REQUEST);
        }
      }

      var newContacts = foundUser.contact;
      // foundUser.contact.forEach((contact, i) => {
      //   newContacts.push(contact);
      // })
      // user.contact = newContacts;      WAS NOT WORKING

      for(var i = 0; i < user.contact.length; i++){
        newContacts.push(user.contact[i]);
      }

      var hasNewPrimary: boolean = false;
      for(var count = 0; count < user.contact.length && hasNewPrimary == false; count++){
        if(user.contact[count].hasOwnProperty('primary')){
          if(user.contact[count].primary == true){  
            for(var j = 0; j < newContacts.length; j++){
              
              if(!(newContacts[j].email === user.contact[count].email)){
                newContacts[j].primary = false;
              } else {
                newContacts[j].primary = true;
              }
              hasNewPrimary = true;
            }
          }
        }
      }   // Overrides the old primary email if user sets new email as primary

      user.contact = newContacts;
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
  var specialCharArr = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '{', '}', '<', '>',
                        '?', '/', ';', ':', '-', '=', '+', '|', '`', '~', ',', '.', '[', ']'];

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

function ValidateUsername( userName: string){

  if(userName.length < 5 || userName.length > 32){
    throw new HttpException('Username length must be at least 5 characters and no more than 32', HttpStatus.BAD_REQUEST);
  }

  if(isEmail(userName) == true ){
    throw new HttpException('Username cannot be an email address', HttpStatus.BAD_REQUEST);
  }

  var Filter = require('bad-words'),
  filter = new Filter();
  filter.addWords('shithead', 'fuckingking');
  var badUsernameCheck = filter.clean(userName);
  if(badUsernameCheck.includes('*')){
    throw new HttpException('Username cannot contain obscene or profain language', HttpStatus.BAD_REQUEST);
  }
}

function isEmail(search: string){
  var searchFind: boolean;
  var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  searchFind = regexp.test(search);
  return searchFind;
}

