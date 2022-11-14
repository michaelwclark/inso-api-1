import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Model, Connection } from 'mongoose';
import { Calendar, CalendarSchema } from '../src/entities/calendar/calendar';
import { makeFakeCalendarPayload } from '../src/entities/calendar/calendar-fakes';
import {
  DiscussionSet,
  DiscussionSetSchema,
} from '../src/entities/discussion-set/discussion-set';
import {
  Discussion,
  DiscussionSchema,
} from '../src/entities/discussion/discussion';
import { makeFakeDiscussionPayload } from '../src/entities/discussion/discussion-fakes';
import { Grade, GradeSchema } from '../src/entities/grade/grade';
import { makeFakeGradePayload } from '../src/entities/grade/grade-fakes';
import {
  Inspiration,
  InspirationSchema,
} from '../src/entities/inspiration/inspiration';
import { makeFakeInspirationPayload } from '../src/entities/inspiration/inspiration-fakes';
import {
  Milestone,
  MilestoneSchema,
} from '../src/entities/milestone/milestone';
import {
  Notification,
  NotificationSchema,
} from '../src/entities/notification/notification';
import {
  DiscussionPost,
  DiscussionPostSchema,
} from '../src/entities/post/post';
import { Reaction, ReactionSchema } from '../src/entities/reaction/reaction';
import { Score, ScoreSchema } from '../src/entities/score/score';
import { makeFakeScorePayload } from '../src/entities/score/score-fakes';
import { Setting, SettingSchema } from '../src/entities/setting/setting';
import { makeFakeSettingPayload } from '../src/entities/setting/setting-fakes';
import { User, UserSchema } from '../src/entities/user/user';
import { makeFakeUserPayload } from '../src/entities/user/user-fakes';
import faker from './faker';
import { HydratedDocument } from 'mongoose';
import {
  DiscussionType,
  DiscussionTypeSchema,
} from '../src/entities/discussionType/discussion-type';

export interface TestingDatabase {
  calendar: Model<Calendar>;

  connection: Connection;
  discussionSet: Model<DiscussionSet>;
  discussion: Model<Discussion>;
  discussionType: Model<DiscussionType>;
  grade: Model<Grade>;
  inspiration: Model<Inspiration>;
  milestone: Model<Milestone>;
  notification: Model<Notification>;
  post: Model<DiscussionPost>;
  reaction: Model<Reaction>;
  score: Model<Score>;
  setting: Model<Setting>;
  user: Model<User>;
  createFakes: () => Promise<FakeDocuments>;
  clearDatabase: () => Promise<void>;
}

export interface FakeDocuments {
  calendar: HydratedDocument<Calendar>;
  discussionSet: HydratedDocument<DiscussionSet>;
  discussion: HydratedDocument<Discussion>;
  discussionType: HydratedDocument<DiscussionType>;
  grade: HydratedDocument<Grade>;
  inspiration: HydratedDocument<Inspiration>;
  milestone: HydratedDocument<Milestone>;
  notification: HydratedDocument<Notification>;
  post: HydratedDocument<DiscussionPost>;
  reaction: HydratedDocument<Reaction>;
  score: HydratedDocument<Score>;
  setting: HydratedDocument<Setting>;
  user: HydratedDocument<User>;
}

export async function testingDatabase(): Promise<TestingDatabase> {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const mongoConnection = (await connect(uri)).connection;
  const calendarModel: Model<Calendar> = mongoConnection.model(
    Calendar.name,
    CalendarSchema,
  );

  const discussionModel: Model<Discussion> = mongoConnection.model(
    Discussion.name,
    DiscussionSchema,
  );
  const discussionTypeModel: Model<DiscussionType> = mongoConnection.model(
    DiscussionType.name,
    DiscussionTypeSchema,
  );

  const discussionSetModel: Model<DiscussionSet> = mongoConnection.model(
    DiscussionSet.name,
    DiscussionSetSchema,
  );
  const gradeModel: Model<Grade> = mongoConnection.model(
    Grade.name,
    GradeSchema,
  );
  const inspirationModel: Model<Inspiration> = mongoConnection.model(
    Inspiration.name,
    InspirationSchema,
  );
  const milestoneModel: Model<Milestone> = mongoConnection.model(
    Milestone.name,
    MilestoneSchema,
  );
  const notificationModel: Model<Notification> = mongoConnection.model(
    Notification.name,
    NotificationSchema,
  );
  const postModel: Model<DiscussionPost> = mongoConnection.model(
    DiscussionPost.name,
    DiscussionPostSchema,
  );
  const reactionModel: Model<Reaction> = mongoConnection.model(
    Reaction.name,
    ReactionSchema,
  );
  const scoreModel: Model<Score> = mongoConnection.model(
    Score.name,
    ScoreSchema,
  );
  const settingModel: Model<Setting> = mongoConnection.model(
    Setting.name,
    SettingSchema,
  );
  const userModel: Model<User> = mongoConnection.model(User.name, UserSchema);

  const database = {
    calendar: calendarModel,
    connection: mongoConnection,
    discussion: discussionModel,
    discussionSet: discussionSetModel,
    discussionType: discussionTypeModel,
    grade: gradeModel,
    inspiration: inspirationModel,
    milestone: milestoneModel,
    notification: notificationModel,
    post: postModel,
    reaction: reactionModel,
    score: scoreModel,
    setting: settingModel,
    user: userModel,
    createFakes: async () => createFakes(database as TestingDatabase),
    clearDatabase: async () => clearDatabase(database as TestingDatabase),
  };

  return database;
}

async function createFakes(database: TestingDatabase): Promise<FakeDocuments> {
  const user = await database.user.create(makeFakeUserPayload());
  const calendar = await database.calendar.create(makeFakeCalendarPayload());
  const inspiration = await database.inspiration.create(
    makeFakeInspirationPayload(),
  );
  const grade = await database.grade.create(makeFakeGradePayload());
  const score = await database.score.create(
    makeFakeScorePayload({
      criteria: [
        {
          max_points: 5,
          criteria: 'Criteria 1',
        },
        {
          max_points: 5,
          criteria: 'Criteria 2',
        },
      ],
    }),
  );

  const setting = await database.setting.create(
    makeFakeSettingPayload({
      userId: user._id,
      calendar: calendar._id,
      post_inspirations: [inspiration._id],
      score: score._id,
    }),
  );

  const discussion = await database.discussion.create(
    makeFakeDiscussionPayload({
      archived: null,
      settings: setting._id,
      poster: user._id,
      participants: [
        {
          user: user._id,
          joined: faker.date.past(),
          muted: faker.datatype.boolean(),
          grade: grade._id,
        },
      ],
    }),
  );
  const discussionType = await database.discussionType.create({});
  const discussionSet = await database.discussionSet.create({});
  const milestone = await database.milestone.create({});
  const notification = await database.notification.create({});
  const post = await database.post.create({
    discussionId: discussion._id,
    userId: user._id,
  });
  const reaction = await database.reaction.create({});

  return {
    calendar,
    discussionSet,
    discussionType,
    discussion,
    grade,
    inspiration,
    milestone,
    notification,
    post,
    reaction,
    score,
    setting,
    user,
  };
}

const clearDatabase = async (database: TestingDatabase) => {
  await database.calendar.deleteMany({});
  await database.discussion.deleteMany({});
  await database.discussionSet.deleteMany({});
  await database.grade.deleteMany({});
  await database.inspiration.deleteMany({});
  await database.milestone.deleteMany({});
  await database.notification.deleteMany({});
  await database.post.deleteMany({});
  await database.reaction.deleteMany({});
  await database.score.deleteMany({});
  await database.setting.deleteMany({});
  await database.user.deleteMany({});
};
