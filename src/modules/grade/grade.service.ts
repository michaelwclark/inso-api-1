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
import * as schedule from 'node-schedule';

@Injectable()
export class GradeService {
    constructor(
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
        @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>,
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
        @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>
    ) {}

    async addEventForAutoGrading(details: any) { // needs discussion id and close date
      const date = new Date("Tue Aug 23 2022 14:37:30 GMT-0400 (Eastern Daylight Time)");

      const job = schedule.scheduleJob(date, function(){
        console.log('The world is going to end today.');
      });
      console.log(job);
    }

    async gradeDiscussion(discussionId: string) {
        // Retrieve the discussion and make sure it exists and that it is set for autograding
        const discussion = await this.discussionModel.findOne(
            { _id: discussionId}
          ).populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();
        

        const foundDiscussion = await this.discussionModel.findOne({ _id: discussionId })
          .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
          .populate('poster', ['f_name', 'l_name', 'email', 'username'])
          .populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();

        var now = new Date();
        //console.log(now);

        const newDiscussion = new DiscussionReadDTO(foundDiscussion);
        //console.log(newDiscussion.settings.calendar.close);

        var closeDate = new Date(newDiscussion.settings.calendar.close);
        //console.log(closeDate);
        closeDate.setHours(0,0,0,0); // set hour to midnight or beginning of date
        //console.log(closeDate);
        const addSubtractDate = require("add-subtract-date");
        closeDate = addSubtractDate.add(closeDate, 1, "minute"); // add one minute to closing date 
        //console.log(closeDate);

        //console.log(foundDiscussion.settings);
        if(!discussion) {
            throw new HttpException(`${discussionId} does not exist as a discussion`, HttpStatus.NOT_FOUND);
        }
        if(newDiscussion.settings.scores == undefined) {
          throw new HttpException(`${discussionId} is missing a rubric`, HttpStatus.BAD_REQUEST);
        }
        if(newDiscussion.settings.scores.type !== 'auto') {
            throw new HttpException(`${discussionId} is not set for autograding`, HttpStatus.BAD_REQUEST);
        }
        if(closeDate < now){
          throw new HttpException('Discussion has not been closed yet', HttpStatus.BAD_REQUEST);
        }
        if(discussion.participants.length == 0){
          throw new HttpException('Discussion has no participants to grade', HttpStatus.BAD_REQUEST);
        }
        // Go through each participant and grade them according to the auto grading requirements
        // for await(const participant of discussion.participants) {
        //     await this.gradeParticipant(new Types.ObjectId(newDiscussion._id), new Types.ObjectId(newDiscussion.poster._id), new Types.ObjectId(participant.user), newDiscussion.settings.scores);
        // }

        //const schedule = require('node-schedule');  imported at top

        // const job = schedule.scheduleJob('12 * * * *', function(){
        //   console.log('The answer to life, the universe, and everything!');
        // });

        const job = schedule.scheduleJob(closeDate, async function(){
          for await(const participant of discussion.participants) {
            await this.gradeParticipant(new Types.ObjectId(newDiscussion._id), new Types.ObjectId(newDiscussion.poster._id), new Types.ObjectId(participant.user), newDiscussion.settings.scores);
          }
        });
    }

    private async gradeParticipant(discussionId: Types.ObjectId, facilitator: Types.ObjectId, participantId: Types.ObjectId, rubric: any) {
      // Add check to see if the discussion is actually closed
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
              max_points: gradeCriteria.post_inspirations.max_points,
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
        const graded = await this.gradeModel.findOne({ discussionId: discussionId, userId: participantId }).lean();
        if(!graded) {
          const saveGrade = new this.gradeModel({grade: confirmedGrade.total, maxScore: max, rubric: confirmedGrade.criteria, discussionId: discussionId, userId: participantId, facilitator: facilitator, comment: confirmedGrade.comments});
        await saveGrade.save();
        } else {
          await this.gradeModel.findOneAndUpdate({ discussionId: discussionId, userId: participantId}, {grade: confirmedGrade.total, maxScore: max, rubric: confirmedGrade.criteria, facilitator: facilitator, comment: confirmedGrade.comments})
        }
    }
}