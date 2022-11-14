import { ApiProperty } from '@nestjs/swagger';

export class NotificationReadDTO {
  @ApiProperty({
    name: '_id',
    description: 'The unique id of the notification',
    required: true,
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    name: 'user',
    description: 'The user the notification is for',
    required: true,
    example: {
      f_name: 'Paige',
      l_name: 'Zaleppa',
      username: 'pzalep1',
      email: 'pzalep1@students.towson.edu',
    },
  })
  user: {
    f_name: string;
    l_name: string;
    username: string;
    email: string;
    profilePicture: string;
  };

  @ApiProperty({
    name: 'date',
    description: 'The date of the notification',
    required: true,
    example: 'Fri Apr 15 2022 13:01:58 GMT-0400 (Eastern Daylight Time)',
  })
  date: Date;

  @ApiProperty({
    name: 'notificationHeader',
    description: 'The header of the notification',
    required: true,
    example: 'Notification header',
  })
  notificationHeader: string;

  @ApiProperty({
    name: 'notificationText',
    description: 'The text of the notification',
    required: true,
    example: 'Notification body',
  })
  notificationText: string;

  @ApiProperty({
    name: 'type',
    description: 'Is either post, reply, upvote, reaction',
    required: true,
    example: 'badge',
  })
  type: string;

  @ApiProperty({
    name: 'notificationUser',
    description:
      'The user that performed the action to generate the notification',
    required: true,
  })
  notificationUser: {
    f_name: string;
    l_name: string;
    username: string;
    email: string;
    profilePicture: string;
  };

  constructor(partial: any) {
    if (partial) {
      this._id = partial._id;
      this.user = {
        f_name: partial.userId.f_name,
        l_name: partial.userId.l_name,
        username: partial.userId.username,
        email: partial.userId.contact[0].email,
        profilePicture: partial.userId.profilePicture
      };
      this.date = partial.date;
      this.notificationHeader = partial.header;
      this.notificationText = partial.text;
      this.type = partial.type;
      this.notificationUser = partial.notificationUser
        ? {
          f_name: partial.notificationUser.f_name,
          l_name: partial.notificationUser.l_name,
          username: partial.notificationUser.username,
          email: partial.notificationUser.contact[0].email,
          profilePicture: partial.notificationUser.profilePicture
        }
        : {
          f_name: undefined,
          l_name: undefined,
          username: undefined,
          email: undefined,
          profilePicture: undefined
        };
    }
  }
}
