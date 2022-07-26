import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";

export class UserStatistic {
    @ApiProperty({
        name: 'discussions_joined',
        description: 'The number of discussions joined',
        required: true,
    })
    discussions_joined: number;

    @ApiProperty({
        name: 'discussions_created',
        description: 'The number of discussions created',
        required: true,
    })
    discussions_created: number;

    @ApiProperty({
        name: 'posts_made',
        description: 'The number of posts created',
        required: true,
    })
    posts_made: number;

    @ApiProperty({
        name: 'comments_received',
        description: 'The number of comments received',
        required: true,
    })
    comments_received: number;

    @ApiProperty({
        name: 'upvotes',
        description: 'The number of upvotes received',
        required: true,
    })
    upvotes: number;

    constructor(partial: Partial<UserStatistic>) {
        if(partial) {
            this.discussions_joined = partial.discussions_joined;
            this.discussions_created = partial.discussions_created;
            this.posts_made = partial.posts_made;
            this.comments_received = partial.comments_received;
            this.upvotes = partial.upvotes;
        }
    }
}

export class UserReadDTO {
    @ApiProperty({
        name: '_id',
        description: 'The id of the user',
        required: true,
    })
    _id: string;

    @ApiProperty({
        name: 'username',
        description: 'The username of the user',
        required: true,
        example: 'lastfirst'
    })
    username: string;

    @ApiProperty({
        name: 'f_name',
        description: 'The first name of the user',
        required: true,
        example: 'first'
    })
    f_name: string;

    @ApiProperty({
        name: 'l_name',
        description: 'The last name of the user',
        required: true,
        example: 'last'
    })
    l_name: string;

    @ApiProperty({
        name: 'contact',
        description: 'List of contact emails for the user',
        required: true,
        isArray: true,
        example: [ {
            'email': 'mockemail',
            'primary': true,
            'verified': true
        } ]
    })
    contact: {
        'email': string,
        'verified': boolean,
        'primary': boolean
        }[];

    @ApiProperty({
        name: 'level',
        description: 'The level of the student or the teacher',
        required: true,
        example: 'college'
    })
    level: string;

    @ApiProperty({
        name: 'role',
        description: 'The role that the user is (i.e. principal, teacher, student)',
        required: true,
        example: 'teacher'
    })
    role: string;

    @ApiProperty({
        name: 'statistics',
        description: 'The statistics for a given user',
        required: true,
        type: UserStatistic
    })
    @ValidateNested()
    statistics: UserStatistic;


    constructor(partial: Partial<UserReadDTO>) {
        if(partial) {
            this._id = partial._id;
            this.username = partial.username;
            this.f_name = partial.f_name;
            this.l_name = partial.l_name;
            this.contact = partial.contact;
            this.level = partial.level;
            this.role = partial.role;
            this.statistics = partial.statistics;
        }
    }
}