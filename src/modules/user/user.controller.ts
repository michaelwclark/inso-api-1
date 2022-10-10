import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Query, Redirect } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiBody, ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { ContactCreateDTO, UserCreateDTO } from '../../entities/user/create-user';
import { UserEditDTO } from '../../entities/user/edit-user';
import { User, UserDocument } from '../../entities/user/user';
import * as bcrypt from 'bcrypt';
import { SENDGRID_TEMPLATES, SGService } from '../../drivers/sendgrid';
import { validatePassword } from '../../entities/user/commonFunctions/validatePassword';
import { decodeOta, generateCode } from '../../drivers/otaDriver';
import * as MAIL_DEFAULTS from "../../drivers/interfaces/mailerDefaults";

@Controller()
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private sgService: SGService
  ) {}

  //** TEMPORARY GET REQUEST, for password reset route. Will delete soon. */
  @Get('password-reset')
  @Redirect(process.env.PASSWORD_RESET_PAGE)
  async passwordTest(@Query('ota') ota: string){
    const code = await decodeOta(ota);
    
    const checkVerified = await this.userModel.findOne({'contact.email' : code.data});

    await this.userModel.findOneAndUpdate({'contact.email': code.data}, { $set: {'contact.$.verified': true}});
    return { url: process.env.PASSWORD_RESET_PAGE + `?ota=` + ota};
  }

<<<<<<< HEAD
  @Get('email-verified')
  @Redirect(process.env.VERIFIED_REDIRECT)
  async verifyEmailRoute(@Query('ota') ota: string) {
    const val = await this.verifyEmailToken(ota);
    return { url: process.env.VERIFIED_REDIRECT + val};
  }


  @HttpCode(200)
  @Post('user')
  @ApiOperation({description: 'Request will create a new user'})
  @ApiBody({description: 'Must be of correct format UserCreateDTO type', type: UserCreateDTO})
  @ApiOkResponse({description: 'User created successfully'})
  @ApiTags('User')
  async createUser(@Body() user: UserCreateDTO){

    let username = user.f_name + user.l_name;
    let sameUsername = await this.userModel.findOne({username: username});
    while(sameUsername) {
      username = username + Math.floor(Math.random() * 40).toString();
      sameUsername = await this.userModel.findOne({username: username});
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

    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);

    const newUser = new this.userModel({...user, 'dateJoined': new Date(), username: username });
    await newUser.save();

    const verifyUser = { 
      name: user.f_name + ' ' + user.l_name, 
      username: username, 
      contact: user.contact[0].email 
    }
    await this.sendEmailVerification(verifyUser);

    return 'User Created! Please check your email inbox to verify your email address';
  }

  @Post('password-reset/:email')
  async resetPasswordRequest(@Param('email') email: string){
    if(isEmail(email) == false ){
      throw new HttpException('Please enter a valid email address', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userModel.findOne({'contact.email': email});
    if(!foundUser){ 
      throw new HttpException("No account associated with email: " + email, HttpStatus.NOT_FOUND); 
    }
    const userPasswordRequest = {
      name: foundUser.f_name + ' ' + foundUser.l_name, 
      username: foundUser.username, 
      contact: email 
    }
    const ota = await generateCode(userPasswordRequest.contact);
    await this.sgService.resetPassword({...userPasswordRequest, link: 'http://localhost:3000/password-reset?ota=' + ota.code});
    return 'Password reset request has been sent to email: ' + email;
  }

  @Patch('user/:userId')
  @ApiOperation({description: 'Update a user entity'})
  @ApiBody({description: 'Body must be of correct format UserEditDTO type', type: UserEditDTO})
  @ApiOkResponse({ description: 'User edited!'})
  @ApiBadRequestResponse({ description: 'The calendar is not of the correct format.'})
  @ApiTags('User')
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

      var oldContacts = foundUser.contact; // old set of contacts from existing user that was retrieved

      var contactsToDelete = user.contact.filter(function (e) {
        return e.delete == true;
      }); // new array of elements to remove from current contacts
      var contactsToKeep = user.contact.filter(function (e) {
        return e.delete != true;
      }); // new array of new elements to add to current contacts

      for (var i = 0; i < contactsToDelete.length; i++) {
        await this.userModel.updateMany({}, { $pull: { contact : {email: contactsToDelete[i].email} } })
      } // removing all contacts from the delete array, that are present in the database

      var hasNewPrimary: boolean = false;
      for(var _i = 0; _i < contactsToKeep.length && hasNewPrimary == false; _i++){
        if(contactsToKeep[_i].primary == true){
          var primaryIndex = _i;
          hasNewPrimary = true;
        }
      } // checks if there is a new primary contact to overwrite the old, and stores the index value

      var updatedFoundContacts = (await this.userModel.findOne({_id: userId})).contact;
      contactsToKeep.map(x => { x.verified = false; x.primary = false; return x; })

      if(hasNewPrimary == true){
        contactsToKeep[primaryIndex].primary = true;
        updatedFoundContacts.map(x => { x.verified = false; x.primary = false; return x; })
      }// overwrites old primary contact if a new one was given
      
      user.contact = updatedFoundContacts.concat(contactsToKeep);

      if(user.contact.length == 0){
        await this.userModel.updateOne({_id: userId}, {$set: {contact: oldContacts}});
        throw new HttpException('You must have at least one email contact', HttpStatus.BAD_REQUEST);
      } // checks that not all contacts were removed

      var primaryTest = user.contact.filter(function (e) {
        return e.primary == true;
      }) // returns the contacts with primary as true
      if(primaryTest.length != 1){
        await this.userModel.updateOne({_id: userId}, {$set: {contact: oldContacts}});
        throw new HttpException('You must have only one primary email contact', HttpStatus.BAD_REQUEST);
      } // checks that only one contact is set as primary
  
    }

    const res = await foundUser.updateOne(user);

    return 'User Updated';
  }

  @Patch('password-reset')
  async resetPassword(
    @Body() newPassword:{ password: string, confirmPassword: string },
    @Query('ota') ota: string
  ){
    if(newPassword.password !== newPassword.confirmPassword){
      throw new HttpException('Password and confirm password fields must match', HttpStatus.BAD_REQUEST);
    }
    validatePassword(newPassword.password);
    this.verifyPasswordResetToken(ota, newPassword.password);
  }

  //**  Uses SendGrid to send email, function is performed at the end of user registration (POST USER ROUTE) */
  async sendEmailVerification(user: any){
    const ota = await generateCode(user.contact);
    return await this.sgService.sendEmail({...user, template: SENDGRID_TEMPLATES.CONFIRM_EMAIL, action: MAIL_DEFAULTS.SUBJECTS.CONFIRM_EMAIL, data: { link: process.env.EMAIL_VERIFICATION_REDIRECT + ota.code}});
  }

  async verifyEmailToken(ota: string){
    const code = await decodeOta(ota);
    
    const checkVerified = await this.userModel.findOne({'contact.email' : code.data});
    const arr = checkVerified.contact;
    for(let e of arr){
      if (e.email == code.data && e.verified == true){
        throw new HttpException('Email has already been verified', HttpStatus.CONFLICT);
      }
    }

    await this.userModel.findOneAndUpdate({'contact.email': code.data}, { $set: {'contact.$.verified': true}});
    return true;
  }

  async sendPasswordResetRequest(user: any){
    const ota = await generateCode(user.contact);
    return await this.sgService.sendEmail({...user, template: SENDGRID_TEMPLATES.PASSWORD_RESET_REQUEST, action: MAIL_DEFAULTS.SUBJECTS.RESET_PASSWORD, data: { link: process.env.EMAIL_VERIFICATION_REDIRECT + ota.code}});
  }

  async verifyPasswordResetToken(ota: string, password: string){
    const code = await decodeOta(ota);
    const saltRounds = 10;
    const newPassword = await bcrypt.hash(password, saltRounds);
    const user = await this.userModel.findOneAndUpdate({'contact.email': code.data}, {$set: {'password': newPassword}});
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
