import { ApiProperty } from "@nestjs/swagger";

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

    constructor(partial: Partial<UserReadDTO>) {
        if(partial) {
            this._id = partial._id;
            this.username = partial.username;
            this.f_name = partial.f_name;
            this.l_name = partial.l_name;
            this.contact = partial.contact;
            this.level = partial.level;
            this.role = partial.role;
        }
    }
}