import { ConsoleLogger, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { DiscussionReadDTO } from "src/entities/discussion/read-discussion";
import * as AWS from "aws-sdk";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";
import { GradeDTO } from "src/entities/grade/create-grade";

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
        for await(const participant of discussion.participants) {
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
          total: 0,
          criteria: [
          //  {
          //   criteria: "",
          //   max_points: 0,
          //   earned: 0
          // }
        ],
        comments: ""
        };

        // Retrieve the users posts in the discussionId and any of there posts and reactions to determine the following
        const posts = [];
        const dbPosts = await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, userId: new Types.ObjectId(participantId) });
        
        if(gradeCriteria.posts_made !== null) {
          if(posts.length !== gradeCriteria.posts_made.required) {
            // Determine how many they are off and calculate the grade
            
            var tempGrade =  dbPosts.length; // / gradeCriteria.posts_made.max_points ;
            grade.criteria.push({
              criteria: 'posts made',
              max_points: gradeCriteria.posts_made.max_points,
              earned: tempGrade
            });
            grade.total = grade.total + tempGrade;
          }
        }
        if(gradeCriteria.active_days !== null) {
          // Determine the number of days that they either posted or made a reaction in the discussion

          let dates = []
          let activeDates = []
          dbPosts.forEach( element => {
            var newDate = element.date.toLocaleDateString('en-US');
            dates.push(newDate);
            activeDates = [...new Set(dates)];
          })

          // if(activeDates.length < gradeCriteria.active_days.required ){
          //   throw new HttpException('Number of active days is below requirement', HttpStatus.BAD_REQUEST);
          // }
          const activeDatesGrade = (activeDates.length / gradeCriteria.active_days.max_points) * 10;
          grade.criteria.push({
            criteria: 'active days',
            max_points: gradeCriteria.active_days.max_points,
            earned: activeDatesGrade
          });
          grade.total = grade.total + activeDatesGrade;
        }
        if(gradeCriteria.comments_received) {
          // Determine if the number of comments received on the first post suffices. If they have multiple posts determine if they have comments
          
          var commentsToUser = 0

          var commentsArray = await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, comment_for:{$ne:null} });
          
          commentsArray.forEach( async element => {
            var tempCom = await this.discussionPostModel.findOne({ _id: element.comment_for })
            console.log(tempCom.userId);
            console.log(participantId);
            if(new Types.ObjectId(tempCom.userId).equals(participantId)){
              console.log('match!');
              commentsToUser = commentsToUser + 1;
              console.log(commentsToUser);
            }
          });

          console.log(commentsToUser)
        
        }
        if(gradeCriteria.post_inspirations) {
          // See if any of the posts used a post inspiration
          
        }
        
        const confirmedGrade = new GradeDTO(grade);
        console.log(confirmedGrade);
    }
}