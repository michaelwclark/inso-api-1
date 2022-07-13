import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { ContactCreateDTO, UserCreateDTO } from 'src/entities/user/create-user';
import { ContactEditDTO, UserEditDTO } from 'src/entities/user/edit-user';
import { UserReadDTO } from 'src/entities/user/read-user';
import { Contact, User, UserDocument } from 'src/entities/user/user';



@Controller()
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}


  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    
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

    const returnUser = new UserReadDTO(foundUser);

    return returnUser;
  }

  @HttpCode(200)
  @Post('user')
  @ApiOperation({description: 'Request will create a new user'})
  @ApiBody({description: 'Must be of correct format UserCreateDTO type', type: UserCreateDTO})
  @ApiOkResponse({description: 'User created successfully'})
  @ApiTags('User')
  async createUser(@Body() user: UserCreateDTO){

    validateUsername(user.username);
    
    const sameUsername = await this.userModel.findOne({username: user.username})
    if(!(sameUsername == undefined)){
      throw new HttpException('Username already exists, please choose another', HttpStatus.BAD_REQUEST);
    }
    
    checkForDuplicateContacts(user.contact); // throws error if same email appears more than once

    var array = user.contact.map(x => {
      x.verified = false; 
      x.primary = false;
      return x
    })
    array[0].primary = true;    
    user.contact = array;

    for await (const contact of user.contact) {
      const sameEmail = await this.userModel.findOne({'contact.email': contact.email})
      if(sameEmail != undefined){ 
        throw new HttpException('Email ' + contact.email + ' already is associated with an account', HttpStatus.BAD_REQUEST)
      } // checks and throws error if any of the given emails are already in use
    }

    validatePassword(user.password);

    const newUser = new this.userModel({...user, 'dateJoined': new Date()})
    await newUser.save()

    return 'User Created!';
  }

  @Patch('user/:userId')
  @ApiOperation({description: 'Update a user entity'})
  @ApiBody({description: 'Body must be of correct format UserEditDTO type', type: UserEditDTO})
  @ApiOkResponse({ description: 'User edited!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  async updateUser(@Param('userId') userId: string, @Body() user: UserEditDTO){

    // user id validation
    if(userId === null){
      throw new HttpException("No user id provided", HttpStatus.BAD_REQUEST);
    }
    if(!Types.ObjectId.isValid(userId)){
      throw new HttpException("User id is not valid", HttpStatus.BAD_REQUEST);
    }

    // check if user does exist
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

      checkForDuplicateContacts(user.contact); // throws error if same email appears more than once

      for await (const contact of user.contact) {
        const sameEmail = await this.userModel.findOne({'contact.email': contact.email})
        if(sameEmail != undefined && contact.delete != true){ 
          throw new HttpException('Email ' + contact.email + ' already is associated with an account', HttpStatus.BAD_REQUEST)
        } // checks and throws error if any of the given emails are already in use
      }

      var oldContacts = foundUser.contact; // old set of contacts from existing user that was found

      var hasNewPrimary: boolean = false;
      for(var _i = 0; _i < user.contact.length && hasNewPrimary == false; _i++){
        if(user.contact[_i].primary == true){
          var primaryIndex = _i;
          hasNewPrimary = true;
        }
      } // checks if there is a new primary contact to overwrite the old, and stores the index value

      user.contact.map(x => { x.verified = false; x.primary = false; return x; })

      if(hasNewPrimary == true){
        user.contact[primaryIndex].primary = true;
        oldContacts.map(x => { x.verified = false; x.primary = false; return x; })
      } // overwrites old primary contact if a new one was given

      user.contact = removeUnwantedContacts(user.contact, oldContacts); // deletes contacts with delete value true
    }

    const res = await foundUser.updateOne(user);

    return 'User Updated';
  }
}

/** validates the username for a new user or when updating a username, the value meets all  required conditions */
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

/** uses regex to ensure a string is a valid email address */
function isEmail(search: string){
  var searchFind: boolean;
  var regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

  searchFind = regexp.test(search);
  return searchFind;
}

/** validates the password for a new user meets all the required conditions to ensure password strength */
function validatePassword(password: string){

  if(password.length < 8 || password.length > 32){
    throw new HttpException('Password length must be at least 8 characters and no more than 32', HttpStatus.BAD_REQUEST)
  }

  var checkStrength: boolean;
  var lowercaseRegexp = new RegExp('(?=.*[a-z])')
  var uppercaseRegexp = new RegExp('(?=.*[A-Z])')
  var numberRegexp = new RegExp('(?=.*[0-9])')
  var specialCharRegexp = new RegExp('(?=.*[^A-Za-z0-9])')

  checkStrength = lowercaseRegexp.test(password);
  if(checkStrength == false){ 
    throw new HttpException('Password must contain at least one lowercase character', HttpStatus.BAD_REQUEST)
  }

  checkStrength = uppercaseRegexp.test(password);
  if(checkStrength == false){ 
    throw new HttpException('Password must contain at least one uppercase character', HttpStatus.BAD_REQUEST)
  }

  checkStrength = numberRegexp.test(password);
  if(checkStrength == false){ 
    throw new HttpException('Password must contain at least one number', HttpStatus.BAD_REQUEST)
  }

  checkStrength = specialCharRegexp.test(password);
  if(checkStrength == false){ 
    throw new HttpException('Password must contain at least one special character', HttpStatus.BAD_REQUEST)
  }

}

/** checks if array of new contacts in User create or edit DTOs, contains duplicate emails */
function checkForDuplicateContacts(array: ContactCreateDTO[]){

  let contactsArray = array;
  let unique = contactsArray.filter((c, index, self) => 
    index === self.findIndex((t) => (
      t.email === c.email
    )))

  if(array.length != unique.length){ throw new HttpException('Cannot have duplicate emails in array', HttpStatus.BAD_REQUEST)}
  else { return unique }

}

/** removes contacts with delete boolean marker as true, for patch route */
function removeUnwantedContacts(array: ContactEditDTO[], oldArray: Contact[]){

  var contactsToDelete = array.filter(function (e) {
    return e.delete == true;
  }); // new array of elements to remove from current contacts
  var contactsToKeep = array.filter(function (e) {
    return e.delete != true;
  }); // new array of new elements to add to current contacts

  var flag: boolean = false;
  for(var _i = 0; _i < oldArray.length; _i++){
    flag = false;
    for(var d = 0; d < contactsToDelete.length && flag == false; d++){
      if(oldArray[_i].email == contactsToDelete[d].email){
        oldArray[_i].delete = true;
        flag = true;
      }
    }
  }

  var updatedPreviousContacts = oldArray.filter(function (e) {
    return e.delete != true; 
  }) // current contacts after removing the unwanted emails

  var newContacts = updatedPreviousContacts.concat(contactsToKeep); // current contacts plus new emails

  if(newContacts.length == 0){
    throw new HttpException('You must have at least one email contact', HttpStatus.BAD_REQUEST);
  } // checks that not all contacts were removed

  var primaryTest = newContacts.filter(function (e) {
    return e.primary == true;
  }) // returns the contacts with primary as true
  if(primaryTest.length != 1){
    throw new HttpException('You must have one and only one primary email contact', HttpStatus.BAD_REQUEST);
  } // checks that only one contact is set as primary
  
  return newContacts;
}