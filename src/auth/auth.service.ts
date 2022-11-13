import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DiscussionDocument } from '../entities/discussion/discussion';
import { DiscussionPostDocument } from '../entities/post/post';
import { CalendarDocument } from '../entities/calendar/calendar';
import { ScoreDocument } from '../entities/score/score';
import { UserDocument } from '../entities/user/user';
import { validatePassword } from '../entities/user/commonFunctions/validatePassword';
import { GoogleUserDTO } from '../entities/user/google-user';
import { UserReadDTO } from '../entities/user/read-user';
import { ReactionDocument } from '../entities/reaction/reaction';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectModel('Discussion')
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel('DiscussionPost')
    private postModel: Model<DiscussionPostDocument>,
    @InjectModel('Score') private scoreModel: Model<ScoreDocument>,
    @InjectModel('Calendar') private calendarModel: Model<CalendarDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Reaction') private reactionModel: Model<ReactionDocument>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ 'contact.email': email });
    if (!user) {
      throw new HttpException(
        'Email does not exist in database',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.password) {
      throw new HttpException(
        'User has Google SSO configured. Please login through Google',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch == false) {
      throw new HttpException(
        'Invalid credentials, password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.login(user);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /** GOOGLE LOGIN */
  async googleLogin(req: any) {
    if (!req.user) {
      throw new HttpException(
        'User does not exist to Google!',
        HttpStatus.NOT_FOUND,
      );
    }
    // Check out db for the user and see if the email is attached
    const user = await this.userModel.findOne({
      'contact.email': req.user.email,
    });
    if (user == null) {
      let username = req.user.firstName + req.user.lastName;
      let sameUsername = await this.userModel.findOne({ username: username });
      let counter = 1;
      const baseUsername = username;
      username = username + counter.toString();
      while (sameUsername && counter < 5000) {
        sameUsername = await this.userModel.findOne({ username: username });
        username = baseUsername + counter.toString();
        counter++;
      }
      // Create a user based on the req.user
      const newUser = new GoogleUserDTO({
        f_name: req.user.firstName,
        l_name: req.user.lastName,
        username: username,
        contact: [
          {
            email: req.user.email,
            verified: false,
            primary: true,
          },
        ],
      });
      const userSave = new this.userModel({
        ...newUser,
        dateJoined: new Date(),
      });
      await userSave.save();
      return;
    } else {
      const payload = { username: user.username, sub: user._id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
  /**
   * Reset Password
   * @param userId
   * @param oldPassword
   * @param newPassword
   * @returns
   */

  async resetPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    this.verifyMongoIds([userId]);
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch == false) {
      throw new HttpException(
        'Invalid credentials, old password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }

    validatePassword(newPassword);

    const saltRounds = 10;
    const password = await bcrypt.hash(newPassword, saltRounds);

    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { password: password },
    );
  }

  async resetPasswordFromEmail(userId: string, newPassword: string) {
    this.verifyMongoIds([userId]);
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });

    validatePassword(newPassword);

    const saltRounds = 10;
    const password = await bcrypt.hash(newPassword, saltRounds);

    return await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { password: password },
    );
  }

  /**
   *
   * @param userId
   * @param discussionId
   * @returns
   */
  async fetchUserAndStats(userId: string) {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(userId) })
      .lean();
    const stats = {
      discussions_created: 0,
      discussions_joined: 0,
      posts_made: 0,
      comments_received: 0,
      upvotes: 0,
    };
    stats.discussions_created = await this.discussionModel
      .find({ poster: new Types.ObjectId(userId) })
      .count();
    stats.discussions_joined = await this.discussionModel
      .find({ 'participants.user': new Types.ObjectId(userId) })
      .count();
    const posts_made = await this.postModel.find({
      userId: new Types.ObjectId(userId),
    });
    stats.posts_made = posts_made.length;

    // Put all the posts_made ids into an array and then use that to query for the comments_received and the upvotes
    const postIds = posts_made.map((post) => {
      return post._id;
    });

    // Aggregate based on all the posts and how many of their posts ids are in the comment_for attribute
    stats.comments_received = await this.postModel
      .find({ comment_for: { $in: postIds } })
      .count();

    // Aggregate based on the posts and if they were upvoted for
    stats.upvotes = await this.reactionModel
      .find({ postId: { $in: postIds }, reaction: '+1' })
      .count();
    return new UserReadDTO({ ...user, statistics: stats });
  }

  /** AUTHORIZATION DECORATOR FUNCTIONS */

  async isDiscussionCreator(
    userId: string,
    discussionId: string,
  ): Promise<boolean> {
    const isCreator =
      (await this.discussionModel.findOne({
        _id: new Types.ObjectId(discussionId),
        poster: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isCreator) {
      throw new HttpException(
        `User: ${userId} is not permitted to perform this action on the discussion`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isCreator;
  }

  async isDiscussionFacilitator(userId: string, discussionId: string) {
    const isFacilitator =
      (await this.discussionModel.findOne({
        _id: new Types.ObjectId(discussionId),
        facilitators: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isFacilitator) {
      throw new HttpException(
        `User: ${userId} is not a facilitator and cannon perform action on the discussion`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isFacilitator;
  }

  async isDiscussionParticipant(userId: string, discussionId: string) {
    const discussion = await this.discussionModel.findOne({
      _id: new Types.ObjectId(discussionId),
    });
    if (!discussion) {
      throw new HttpException(
        `Discussion could not be found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const participantIds = discussion.participants.map((part) => {
      return part.user.toString();
    });
    if (!participantIds.includes(userId)) {
      throw new HttpException(
        `User: ${userId} is not a participant of the discussion and cannot perform action on the discussion`,
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }

  async isPostCreator(userId: string, postId: string) {
    const isPoster =
      (await this.postModel.findOne({
        _id: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isPoster) {
      throw new HttpException(
        `User: ${userId} is not the author of the post and cannot perform this action`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isPoster;
  }

  async isReactionCreator(userId: string, reactionId: string) {
    const isReactionCreator =
      (await this.reactionModel.findOne({
        _id: new Types.ObjectId(reactionId),
        userId: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isReactionCreator) {
      throw new HttpException(
        `User ${userId} is not the creator of the reaction and cannot modify it`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isReactionCreator;
  }

  async isDiscussionMember(
    userId: string,
    discussionId: string,
  ): Promise<boolean> {
    const isFacilitator =
      (await this.discussionModel.findOne({
        _id: new Types.ObjectId(discussionId),
        facilitators: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    const discussion = await this.discussionModel.findOne({
      _id: new Types.ObjectId(discussionId),
    });
    if (!discussion) {
      throw new HttpException(
        `Discussion does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }
    const participantIds = discussion.participants.map((part) => {
      return part.user.toString();
    });
    const isParticipant = participantIds.includes(userId);

    if (!isFacilitator && !isParticipant) {
      throw new HttpException(
        `${userId} is not a member of this discussion`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isFacilitator || isParticipant;
  }

  async isScoreCreator(userId: string, scoreId: string): Promise<boolean> {
    const isScorer =
      (await this.scoreModel.findOne({
        _id: new Types.ObjectId(scoreId),
        creatorId: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isScorer) {
      throw new HttpException(
        `${userId} is not permitted to perform action on the score`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isScorer;
  }

  async isCalendarCreator(
    userId: string,
    calendarId: string,
  ): Promise<boolean> {
    const isCalendarCreator =
      (await this.calendarModel.findOne({
        _id: new Types.ObjectId(calendarId),
        creator: new Types.ObjectId(userId),
      })) === null
        ? false
        : true;
    if (!isCalendarCreator) {
      throw new HttpException(
        `${userId} is not permitted to perform action on the calendar`,
        HttpStatus.FORBIDDEN,
      );
    }
    return isCalendarCreator;
  }

  //** MONGO ID VERIFICATION */
  verifyMongoIds(ids: string[]) {
    ids.forEach((id) => {
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException(
          `${id} is not a valid Mongo Id`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }
}
