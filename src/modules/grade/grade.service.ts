import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { DiscussionReadDTO } from "src/entities/discussion/read-discussion";
import * as AWS from "aws-sdk";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";

@Injectable()
export class GradeService {

    eventBridge = new AWS.EventBridge({
        credentials: {
          accessKeyId: process.env.AWS_EVENTBRIDGE_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_EVENTBRIDGE_SECRET,
        },
        region: process.env.AWS_REGION,
      });

    constructor(
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
        @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>
    ) {}

    async addEventForAutoGrading() {
        const params = {
            Entries: [
              {
                Source: 'node-js-test', // Must match with the source defined in rules
                Detail: '{ "key1": "value1", "key2": "value2" }', // Need to swap them in for the discussionId and the time
                Resources: ['resource1', 'resource2'],
                DetailType: 'myDetailType',
              },
            ],
          };
          try {
            const event = await this.eventBridge.putEvents(params).promise();
            return { success: true, event };
          } catch (error) {
            return { success: false, error };
          }
    }

    async updateEventForAutoGrading() {
        // Delete the rule and then put it back with the new date to run at 
    }

    async gradeDiscussion(discussionId: string) {
        // Retrieve the discussion and make sure it exists and that it is set for autograding
        const discussion = await this.discussionModel.findOne(
            { _id: discussionId}
          ).populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();
        
        const newDiscussion = new DiscussionReadDTO(discussion);
        if(!discussion) {
            throw new HttpException(`${discussionId} does not exist as a discussion`, HttpStatus.NOT_FOUND);
        }
        if(newDiscussion.settings.scores.type !== 'auto') {
            throw new HttpException(`${discussionId} is not set for autograding`, HttpStatus.BAD_REQUEST);
        }

        // Go through each participant and grade them according to the auto grading requirements
        for await(const participant of newDiscussion.participants) {
            await this.gradeParticipant(new Types.ObjectId(newDiscussion._id), new Types.ObjectId(newDiscussion.poster._id), new Types.ObjectId(participant.user), newDiscussion.settings.scores);
        }
    }

    private async gradeParticipant(discussionId: Types.ObjectId, facilitator: Types.ObjectId, participantId: Types.ObjectId, rubric: any) {
        const total = rubric.total;
        let gradeCriteria = {
          posts_made: rubric.posts_made ? rubric.posts_made : null,
          active_days: rubric.active_days ? rubric.active_days : null,
          comments_received: rubric.comments_received? rubric.comments_received : null,
          post_inspirations: rubric.post_inspirations? rubric.post_inspirations : null
        };
        let grade = {

        };
        // Retrieve the users posts in the discussionId and any of there posts and reactions to determine the following
        const posts = [];
        if(gradeCriteria.posts_made !== null) {
          if(posts.length !== gradeCriteria.posts_made.required) {
            // Determine how many they are off and calculate the grade
            console.log('posts: ' + gradeCriteria.posts_made)
            console.log(await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, userId: new Types.ObjectId(participantId) }))
            const dbPosts = await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, userId: new Types.ObjectId(participantId) });
            console.log('User made ' + dbPosts + ' posts.');
            var tempGrade =  ( dbPosts.length / gradeCriteria.posts_made.max_points ) * 100;
            console.log('final grade would be: ' + tempGrade);
          }
        }
        if(gradeCriteria.active_days !== null) {
          // Determine the number of days that they either posted or made a reaction in the discussion
          console.log('active days: ' + gradeCriteria.active_days)
        }
        if(gradeCriteria.comments_received) {
          // Determine if the number of comments received on the first post suffices. If they have multiple posts determine if they have comments
          console.log('comments recieved: ' + gradeCriteria.comments_received)
        }
        if(gradeCriteria.post_inspirations) {
          // See if any of the posts used a post inspiration
          console.log('post inspirations: ' + gradeCriteria.post_inspirations)
        }
        console.log(discussionId);
        console.log(facilitator);
        console.log(participantId);
        console.log(rubric);
    }
}