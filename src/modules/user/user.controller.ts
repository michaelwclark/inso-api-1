import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { UserCreateDTO } from 'src/entities/user/create-user';
import { UserEditDTO } from 'src/entities/user/edit-user';
import { User, UserDocument } from 'src/entities/user/user';
import * as bcrypt from 'bcrypt';
import { SENDGRID_TEMPLATES, SGService } from 'src/drivers/sendgrid';
import { decodeOta, generateCode } from 'src/drivers/otaDriver';
import * as MAIL_DEFAULTS from 'src/drivers/interfaces/mailerDefaults';
import environment from 'src/environment';
import { validatePassword } from 'src/entities/user/commonFunctions/validatePassword';
import { checkForDuplicateContacts } from 'src/entities/user/commonFunctions/checkForDuplicateContacts';
import { validateUsername } from 'src/entities/user/commonFunctions/validateUsername';
import { isEmail } from 'src/entities/user/commonFunctions/isEmail';
import USER_ERRORS from './user-errors';

@Controller()
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private sgService: SGService,
  ) {}

  //** TEMPORARY GET REQUEST, for password reset route. Will delete soon. */
  @Get('password-reset')
  @Redirect(environment.PASSWORD_RESET_PAGE)
  async passwordTest(@Query('ota') ota: string) {
    const code = await decodeOta(ota);

    await this.userModel.findOneAndUpdate(
      { 'contact.email': code.data },
      { $set: { 'contact.$.verified': true } },
    );
    return { url: environment.PASSWORD_RESET_PAGE + `?ota=` + ota };
  }

  @Get('email-verified')
  @Redirect(environment.VERIFIED_REDIRECT)
  async verifyEmailRoute(@Query('ota') ota: string) {
    const val = await this.verifyEmailToken(ota);
    return { url: environment.VERIFIED_REDIRECT + val };
  }

  @HttpCode(200)
  @Post('user')
  @ApiOperation({ description: 'Request will create a new user' })
  @ApiBody({
    description: 'Must be of correct format UserCreateDTO type',
    type: UserCreateDTO,
  })
  @ApiOkResponse({ description: 'User created successfully' })
  @ApiTags('User')
  async createUser(@Body() user: UserCreateDTO) {
    let username = user.f_name + user.l_name;
    let sameUsername = await this.userModel.findOne({ username: username });
    while (sameUsername) {
      username = username + Math.floor(Math.random() * 40).toString();
      sameUsername = await this.userModel.findOne({ username: username });
    }

    checkForDuplicateContacts(user.contact); // throws error if same email appears more than once

    // Ensure new users are not verified by default
    const array = user.contact.map((x) => {
      x.verified = false;
      x.primary = false;
      return x;
    });
    // Set first contact as primary
    array[0].primary = true;
    user.contact = array;

    const contactEmails = user.contact.map((x) => x.email);

    const foundUser = await this.userModel.countDocuments({
      'contact.email': { $in: contactEmails },
    });

    if (foundUser) {
      throw USER_ERRORS.EMAIL_IN_USE;
    }

    validatePassword(user.password);

    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);

    const newUser = new this.userModel({
      ...user,
      dateJoined: new Date(),
      username: username,
    });
    await newUser.save();

    const verifyUser = {
      name: user.f_name + ' ' + user.l_name,
      username: username,
      contact: user.contact[0].email,
    };
    await this.sendEmailVerification(verifyUser);

    return 'User Created! Please check your email inbox to verify your email address';
  }

  @Post('password-reset/:email')
  async resetPasswordRequest(@Param('email') email: string) {
    if (isEmail(email) == false) {
      throw USER_ERRORS.INVALID_EMAIL;
    }
    const foundUser = await this.userModel.findOne({ 'contact.email': email });
    if (!foundUser) {
      throw USER_ERRORS.USER_NOT_FOUND;
    }
    const userPasswordRequest = {
      userId: foundUser._id,
      name: foundUser.f_name + ' ' + foundUser.l_name,
      username: foundUser.username,
      contact: email,
    };
    const ota = await generateCode(userPasswordRequest);
    await this.sgService.resetPassword({
      ...userPasswordRequest,
      link: environment.PASSWORD_RESET_PAGE + `?ota=` + ota,
    });
    return 'Password reset request has been sent to email';
  }

  @Patch('user/:userId')
  @ApiOperation({ description: 'Update a user entity' })
  @ApiBody({
    description: 'Body must be of correct format UserEditDTO type',
    type: UserEditDTO,
  })
  @ApiOkResponse({ description: 'User edited!' })
  @ApiBadRequestResponse({
    description: 'The calendar is not of the correct format.',
  })
  @ApiTags('User')
  async updateUser(@Param('userId') userId: string, @Body() user: UserEditDTO) {
    // user id validation
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw USER_ERRORS.INVALID_USER_ID;
    }
    // check if user does exist
    const foundUser = await this.userModel.findOne({ _id: userId });
    if (!foundUser) {
      throw USER_ERRORS.USER_NOT_FOUND;
    }

    if (user.hasOwnProperty('username')) {
      validateUsername(user.username);
      const previousUsername = foundUser.username;
      const sameUsername = await this.userModel.findOne({
        username: user.username,
      });
      if (
        !(sameUsername == undefined) &&
        !(sameUsername.username === previousUsername)
      ) {
        throw USER_ERRORS.USERNAME_IN_USE;
      }
    } // Will allow if username is property in patch body but there is no change in value of username for object

    if (user.hasOwnProperty('contact')) {
      checkForDuplicateContacts(user.contact); // throws error if same email appears more than once

      for await (const contact of user.contact) {
        const sameEmail = await this.userModel.findOne({
          'contact.email': contact.email,
        });
        if (sameEmail != undefined && contact.delete != true) {
          throw USER_ERRORS.EMAIL_IN_USE;
        } // checks and throws error if any of the given emails are already in use
      }

      const oldContacts = foundUser.contact; // old set of contacts from existing user that was retrieved

      const contactsToDelete = user.contact.filter(function (e) {
        return e.delete == true;
      }); // new array of elements to remove from current contacts
      const contactsToKeep = user.contact.filter(function (e) {
        return e.delete != true;
      }); // new array of new elements to add to current contacts

      for (let i = 0; i < contactsToDelete.length; i++) {
        await this.userModel.updateMany(
          {},
          { $pull: { contact: { email: contactsToDelete[i].email } } },
        );
      } // removing all contacts from the delete array, that are present in the database

      let hasNewPrimary = false;
      let primaryIndex = 0;
      for (
        let _i = 0;
        _i < contactsToKeep.length && hasNewPrimary == false;
        _i++
      ) {
        if (contactsToKeep[_i].primary == true) {
          primaryIndex = _i;
          hasNewPrimary = true;
        }
      } // checks if there is a new primary contact to overwrite the old, and stores the index value

      const updatedFoundContacts = (
        await this.userModel.findOne({ _id: userId })
      ).contact;
      contactsToKeep.map((x) => {
        x.verified = false;
        x.primary = false;
        return x;
      });

      if (hasNewPrimary == true) {
        contactsToKeep[primaryIndex].primary = true;
        updatedFoundContacts.map((x) => {
          x.verified = false;
          x.primary = false;
          return x;
        });
      } // overwrites old primary contact if a new one was given

      user.contact = updatedFoundContacts.concat(contactsToKeep);

      if (user.contact.length == 0) {
        await this.userModel.updateOne(
          { _id: userId },
          { $set: { contact: oldContacts } },
        );
        throw USER_ERRORS.MISSING_EMAIL;
      } // checks that not all contacts were removed

      // TODO: Remove this portion, it's never going to be true so is unreachable.
      //  Leaving it for now until i can come back and refactor this holistically.
      const primaryTest = user.contact.filter(function (e) {
        return e.primary == true;
      }); // returns the contacts with primary as true
      if (primaryTest.length != 1) {
        await this.userModel.updateOne(
          { _id: userId },
          { $set: { contact: oldContacts } },
        );
        throw USER_ERRORS.ONLY_ONE_PRIMARY_EMAIL;
      } // checks that only one contact is set as primary
    }

    await foundUser.updateOne(user);
    return 'User Updated';
  }

  @Patch('password-reset')
  async resetPassword(
    @Body() newPassword: { password: string; confirmPassword: string },
    @Query('ota') ota: string,
  ) {
    if (newPassword.password !== newPassword.confirmPassword) {
      throw USER_ERRORS.PASSWORDS_DO_NOT_MATCH;
    }
    validatePassword(newPassword.password);
    const code = await decodeOta(ota);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword.password, saltRounds);
    return await this.userModel.findOneAndUpdate(
      { 'contact.email': code.data },
      { $set: { password: hashedPassword } },
      { new: true },
    );
  }

  //**  Uses SendGrid to send email, function is performed at the end of user registration (POST USER ROUTE) */
  async sendEmailVerification(user: any) {
    const ota = await generateCode(user.contact);
    return await this.sgService.sendEmail({
      ...user,
      template: SENDGRID_TEMPLATES.CONFIRM_EMAIL,
      action: MAIL_DEFAULTS.SUBJECTS.CONFIRM_EMAIL,
      data: { link: environment.EMAIL_VERIFICATION_REDIRECT + ota.code },
    });
  }

  async verifyEmailToken(ota: string) {
    const code = await decodeOta(ota);

    const checkVerified = await this.userModel.findOne({
      'contact.email': code.data,
    });
    const arr = checkVerified.contact;
    for (const e of arr) {
      if (e.email == code.data && e.verified == true) {
        throw USER_ERRORS.USER_EMAIL_ALREADY_VERIFIED;
      }
    }

    await this.userModel.findOneAndUpdate(
      { 'contact.email': code.data },
      { $set: { 'contact.$.verified': true } },
    );
    return true;
  }
}
