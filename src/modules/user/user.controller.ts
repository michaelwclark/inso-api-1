import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { ContactCreateDTO, UserCreateDTO } from 'src/entities/user/create-user';
import { UserEditDTO } from 'src/entities/user/edit-user';
import { UserReadDTO } from 'src/entities/user/read-user';
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

    const returnUser: UserReadDTO = {
      'id': foundUser._id,
      'f_name': foundUser.f_name,
      'l_name': foundUser.l_name,
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

    validateUsername(user.username);
    
    const sameUsername = await this.userModel.findOne({username: user.username})
    if(!(sameUsername == undefined)){
      throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
    }
    
    hasDuplicateContacts(user.contact);

    var array = user.contact.map(x => {
      x.verified = false; 
      x.primary = false;
      return x
    })
    array[0].primary = true;    
    user.contact = array;

    for(var i = 0; i < user.contact.length; i++){       
     if(isEmail(user.contact[i].email) == false ){
      throw new HttpException('Email: ' + user.contact[i].email + ', is not a valid email address', HttpStatus.BAD_REQUEST);
     }
     const sameEmail = await this.userModel.findOne({'contact.email': user.contact[i].email})
     if(sameEmail != undefined){
      throw new HttpException('Email ' + user.contact[i].email + ' already is associated with an account', HttpStatus.BAD_REQUEST);
     }
    }

    validatePassword(user.password);

    const newUser = new this.userModel({...user, 'dateJoined': new Date()})
    await newUser.save()

    return 'User Created!';
  }

  @Patch('user/:userId')
  @ApiOperation({description: 'Update a user entity'})
  @ApiBody({description: '', type: UserEditDTO})
  @ApiOkResponse({ description: 'User edited!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  async updateUser(@Param('userId') userId: string, @Body() user: UserEditDTO){

    if(userId === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
    }
    if(!Types.ObjectId.isValid(userId)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userModel.findOne({_id: userId});
    if(!foundUser){
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }

    if(user.hasOwnProperty('username')){
      validateUsername(user.username);
      var previousUsername = foundUser.username; 
      const sameUsername = await this.userModel.findOne({username: user.username})
      if(!(sameUsername == undefined) && (!(sameUsername.username === previousUsername))){
        throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
      } 
    } // Will allow if username is property in patch body but there is no change in value of username for object

    if(user.hasOwnProperty('contact')){

      hasDuplicateContacts(user.contact);

      for(var i = 0; i < user.contact.length; i++){
        if(isEmail(user.contact[i].email) == false ){ throw new HttpException('Email: ' + user.contact[i].email + ', is not a valid email address', HttpStatus.BAD_REQUEST)};
        const sameEmail = await this.userModel.findOne({'contact.email': user.contact[i].email})
        if(sameEmail != undefined ){ throw new HttpException('Email ' + user.contact[i].email + ' already is associated with an account', HttpStatus.BAD_REQUEST) };
      }

      var oldContacts = foundUser.contact;
      var hasNewPrimary: boolean = false;

      for(var _i = 0; _i < user.contact.length && hasNewPrimary == false; _i++){
        if(user.contact[_i].primary == true){
          var primaryIndex = _i;
          hasNewPrimary = true;
          }
      }

      oldContacts.map(x => { x.verified = false; x.primary = false; return x; })
      user.contact.map(x => { x.verified = false; x.primary = false; return x; })

      if(hasNewPrimary == true)
      user.contact[primaryIndex].primary = true;

      // for(var d = 0; d < user.contact.length; d++){
      //   if(user.contact[d].delete == true){
      //     for(var f = 0; f < oldContacts.length; f++){
      //       if(user.contact[d].email === oldContacts[f].email){ 
      //         oldContacts.splice(f, 1);
      //       }
      //     }
      //   }
      // }
      // for(var _d = 0; _d < user.contact.length; _d++){
      //   if(user.contact[_d].delete == true){
      //     user.contact.splice(d, 1);
      //   }
      // }          FOR WHEN I TRIED IMPLEMENTING DELETE

      var newContacts = user.contact.concat(oldContacts);

      user.contact = newContacts;
    }
    
    if(user.hasOwnProperty('sso')){
      if(user.sso.length == 0){throw new HttpException('Array length for SSO cannot be 0', HttpStatus.BAD_REQUEST)};
    }

    const res = await foundUser.updateOne(user);

    return 'User Updated';
  }
}

function validateUsername( userName: string){

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

function validatePassword(password: string){

  if(password.length < 8 || password.length > 32){ throw new HttpException('Password length must be at least 8 characters and no more than 32', HttpStatus.BAD_REQUEST)};
  var checkStrength: boolean;
  var lowercaseRegexp = new RegExp('(?=.*[a-z])')
  var uppercaseRegexp = new RegExp('(?=.*[A-Z])')
  var numberRegexp = new RegExp('(?=.*[0-9])')
  var specialCharRegexp = new RegExp('(?=.*[^A-Za-z0-9])')
  checkStrength = lowercaseRegexp.test(password);
  if(checkStrength == false){ throw new HttpException('Password must contain at least one lowercase character', HttpStatus.BAD_REQUEST)};
  checkStrength = uppercaseRegexp.test(password);
  if(checkStrength == false){ throw new HttpException('Password must contain at least one uppercase character', HttpStatus.BAD_REQUEST)};
  checkStrength = numberRegexp.test(password);
  if(checkStrength == false){ throw new HttpException('Password must contain at least one number', HttpStatus.BAD_REQUEST)};
  checkStrength = specialCharRegexp.test(password);
  if(checkStrength == false){ throw new HttpException('Password must contain at least one special character', HttpStatus.BAD_REQUEST)};

}

function hasDuplicateContacts(array: ContactCreateDTO[]){

  if(array.length == 0){throw new HttpException('Array length for contacts cannot be 0', HttpStatus.BAD_REQUEST)}

  let contactsArray = array;
  let unique = contactsArray.filter((c, index, self) => 
    index === self.findIndex((t) => (
      t.email === c.email
    )))

  if(array.length != unique.length){ throw new HttpException('Cannot have duplicate emails in array', HttpStatus.BAD_REQUEST)}
  else { return unique }

}