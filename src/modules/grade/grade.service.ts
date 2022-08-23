import { ConsoleLogger, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { DiscussionReadDTO } from "src/entities/discussion/read-discussion";
import * as AWS from "aws-sdk";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";
import { GradeDTO } from "src/entities/grade/create-grade";
import { DiscussionController } from "../discussion/discussion.controller";
import { Setting, SettingDocument } from "src/entities/setting/setting";
import { Grade, GradeDocument } from "src/entities/grade/grade";

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
        @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>,
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
        @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>
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
        if(newDiscussion.settings.scores == undefined) {
          throw new HttpException(`${discussionId} is missing a rubric`, HttpStatus.BAD_REQUEST);
        }
        if(newDiscussion.settings.scores.type !== 'auto') {
            throw new HttpException(`${discussionId} is not set for autograding`, HttpStatus.BAD_REQUEST);
        }

        if(discussion.participants.length == 0){
          throw new HttpException('Discussion has no participants to grade', HttpStatus.BAD_REQUEST);
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
          criteria: [],
        comments: ""
        };

        // Retrieve the users posts in the discussionId and any of there posts and reactions to determine the following
        const posts = [];
        const dbPosts = await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, userId: new Types.ObjectId(participantId) });
        
        if(gradeCriteria.posts_made !== null) {
          if(posts.length !== gradeCriteria.posts_made.required) {
            // Determine how many they are off and calculate the grade

            var percentage = ( dbPosts.length / gradeCriteria.posts_made.required ) * 100;
            if(percentage > 100){
              percentage = 100;
            }

            var tempGrade = (gradeCriteria.posts_made.max_points / 100) * percentage;

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

          var percentage = (activeDates.length / gradeCriteria.active_days.required) * 100;
          if(percentage > 100){
            percentage = 100
          }
          var activeDatesGrade = (gradeCriteria.active_days.max_points / 100) * percentage;

          grade.criteria.push({
            criteria: 'active days',
            max_points: gradeCriteria.active_days.max_points,
            earned: activeDatesGrade
          });
          grade.total = grade.total + activeDatesGrade;
        }

        if(gradeCriteria.comments_received) {
          // Determine if the number of comments received on the first post suffices. If they have multiple posts determine if they have comments
          
          var commentsToUser = 0;
          var commentsArray = await this.discussionPostModel.find({ discussionId: new Types.ObjectId(discussionId), draft: false, comment_for:{$ne:null} });
          
          for await (var element of commentsArray) {
            var tempCom = await this.discussionPostModel.findOne({ _id: element.comment_for })
            if(new Types.ObjectId(tempCom.userId).equals(participantId)){
              commentsToUser = commentsToUser + 1;
            }
            break;
          };

          var percentage = ( commentsToUser / gradeCriteria.comments_received.required ) * 100;
          if(percentage > 100){
            percentage = 100;
          }

          var commentsGrade = (gradeCriteria.comments_received.max_points / 100) * percentage;

          grade.criteria.push({
            criteria: 'comments received',
            max_points: gradeCriteria.comments_received.max_points,
            earned: commentsGrade
          });
          grade.total = grade.total + commentsGrade;
        }

        if(gradeCriteria.post_inspirations) {
          // See if any of the posts used a post inspiration
          
          if(gradeCriteria.post_inspirations.selected == true){

            const discussion = await this.discussionModel.findOne({ _id: discussionId});
            const setting = await this.settingModel.findOne({_id: discussion.settings});
            var stopFlag = false;
            if(setting.post_inspirations.length > 0 && dbPosts.length > 0){
              for(var i = 0; i < dbPosts.length && stopFlag == false; i++){
                if(Types.ObjectId.isValid(dbPosts[i].post_inspiration)){
                  stopFlag = true;
                } // checks if any of the user's posts to the discussion, actually used an inspiration
              }
            }

            var inspirationsGrade = 0;
            if(stopFlag == true){
              inspirationsGrade = gradeCriteria.post_inspirations.max_points;
            } // if an inspiration was used on any of the user's posts, full credit is awarded
            grade.criteria.push({
              criteria: 'post inspirations',
              max_points: gradeCriteria.comments_received.max_points,
              earned: inspirationsGrade
            });
            grade.total = grade.total + inspirationsGrade;
          }
        }

        const confirmedGrade = new GradeDTO(grade);
        
        var max = 0;
        for(var i = 0; i < confirmedGrade.criteria.length; i++){
          max = max + confirmedGrade.criteria[i].max_points
        }
        const saveGrade = new this.gradeModel({grade: confirmedGrade.total, maxScore: max, rubric: confirmedGrade.criteria, discussionId: discussionId, userId: participantId, facilitator: facilitator, comment: confirmedGrade.comments});
        await saveGrade.save();
    }
}