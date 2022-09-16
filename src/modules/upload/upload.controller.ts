import { Controller, HttpException, HttpStatus, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { checkFileExtension } from './functions/validFileExtension';
import { Discussion, DiscussionDocument } from 'src/entities/discussion/discussion';
import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entities/user/user';
import * as AWS from "aws-sdk";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller()
export class UploadController {
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
  ) {}

  @Post('upload')
  @ApiOperation({ description: 'Uploads a file and returns the URL location of it'})
  @ApiQuery({
    name: 'type',
    required: true, 
    description: 'What you are trying to upload a file for: discussion, profile, or post'
  })
  @ApiQuery({
    name: 'id',
    required: true, 
    description: 'The mongoId for the discussion, profile, or post'
  })
  @ApiBody({
    required: true,
    description: 'The file that needs to be uploaded'
  })
  @ApiOkResponse({ description: 'The URL of the uploaded file'})
  @ApiUnauthorizedResponse({ description: 'The user does not have a valid token'})
  @ApiForbiddenResponse({ description: 'The user is not allowed to upload a file for the entity id provided'})
  @ApiNotFoundResponse({ description: 'The discussion, profile, or post was not found'})
  @ApiBadRequestResponse({ description: 'A file was not sent, the file is too large (>200MB), or the file does not have a valid extension.'})
  @ApiTags('File Upload')
  //a@UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
    @Query('id') id: string,
    @Req() request: any
    ) {
    if(!file) {
        throw new HttpException('File was not sent', HttpStatus.BAD_REQUEST);
    }
    // Check file size
    if(file.size > 20971520) {
        throw new HttpException('File is too large. File must be under 200MB', HttpStatus.BAD_REQUEST)
    }
    // Make sure they are trying to upload to a valid entity 
    const values = ['profile', 'discussion', 'post'];
    if(!values.includes(type)) {
        throw new HttpException('File can only be uploaded for a discussion, post, or profile', HttpStatus.BAD_REQUEST);
    }
    
    // Check that the file is a valid extension
    checkFileExtension(type, file.originalname);

    // Setup the upload path 
    let filePath = process.env.BUCKET_NAME + '/' + type + '/';

    // Depending on the type see if the id is an actual discussion, post, or user
    // Profile
    if(type === 'profile') {
        const user = await this.userModel.findOne({ _id: id});
        if(!user) {
            throw new HttpException(`User ${id} does not exist`, HttpStatus.NOT_FOUND);
        }
        if(user._id.toString() !== request.user.userId) {
            throw new HttpException(`User ${id} is not the requester`, HttpStatus.FORBIDDEN);
        }
        filePath = filePath + id + '/profile.' + file.originalname.split('.').pop();
    }
    // Discussion
    if(type === 'discussion') {
        const discussion = await this.discussionModel.findOne({ _id: id});
        if(!discussion) {
            throw new HttpException(`Discussion ${id} does not exist`, HttpStatus.NOT_FOUND);
        }
        filePath = filePath + id + '/' + file.originalname;
    }
    // Post
    if(type === 'post') {
        const post = await this.postModel.findOne({ _id: id});
        if(!post) {
            throw new HttpException(`Post ${id} does not exist`, HttpStatus.BAD_REQUEST);
        }
        if(post.userId.toString() !== request.user.userId) {
            throw new HttpException(`Post ${id} does not belong to the user`, HttpStatus.FORBIDDEN);
        }
        filePath = filePath + id + '/' + file.originalname;
    }

    // Upload that file to S3
    const params = 
        {
            Bucket: process.env.BUCKET_NAME,
            Key: filePath,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
            ContentDisposition:"inline",
        };

        try
        {
            let s3Response = await this.s3.upload(params).promise();
            if(type === 'profile') {
                await this.userModel.findOneAndUpdate({ _id: id}, { profilePicture: s3Response.Location});
            }
            return s3Response.Location;
        }
        catch (e)
        {
            throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }

}