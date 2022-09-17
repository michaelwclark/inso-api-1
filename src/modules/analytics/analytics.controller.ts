import { Controller, Get, HttpException, HttpStatus, Param, Query } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BurstChartData, ChartData, ChordChartData, DirectedChartData, TagData } from "src/entities/chart-data/chart-data";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { Inspiration, InspirationDocument } from "src/entities/inspiration/inspiration";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";
import { Reaction, ReactionDocument } from "src/entities/reaction/reaction";
import { User, UserDocument } from "src/entities/user/user";
import { AnalyticsQueryDto } from "./types/query";

@Controller()
export class AnalyticsController {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Inspiration.name) private post_inspirationModel: Model<InspirationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DiscussionPost.name) private postModel: Model<DiscussionPostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}

  @Get('discussion/:discussionId/analytics')
  async getAnalytics(
        @Param('discussionId') discussionId: string,
        @Query() query: AnalyticsQueryDto
    ){
        if(!Types.ObjectId.isValid(discussionId)) {
            throw new HttpException('DiscussionId is not valid', HttpStatus.BAD_REQUEST);
        }
        const discussion = new Types.ObjectId(discussionId);

        const found = await this.discussionModel.findOne({ _id: discussion }).lean();
        if(!found) {
            throw new HttpException('Discussion does not exist', HttpStatus.NOT_FOUND);
        }

        query = new AnalyticsQueryDto(query);
        let chord = new ChordChartData();
        let burst = new BurstChartData();
        let directedChart = new DirectedChartData();

        if(query.chord) {
            chord = await this.getChordChartData(discussion);
        }

        if(query.burst) {
            burst = await this.getBurstChartData(discussion);
        }

        if(query.directed) {
            directedChart = await this.getDirectedChartData(discussion);
        }
    return new ChartData({ chordChartData: chord, burstChartData: burst, directedChartData: directedChart })
  }

  /** PRIVATE FUNCTIONS */

  async getChordChartData(discussionId: Types.ObjectId): Promise<ChordChartData> {
    // Get the tags for a discussion and all of the people that have used them
    // Build the array of people in the order that they were used in the discussion
    // Build the 2D array 
    return new ChordChartData({ keys: ['Josh', 'Paige', 'Nick'], data: [ [0, 32, 12], [32, 0, 24], [12, 24, 0] ]});
  }

  async getBurstChartData(discussionId: Types.ObjectId): Promise<BurstChartData> {
    // Get the top 5 tags for the a discussion and all of the people that have used them as top level comments
    // Set the flare for the discussion as the discussion name
    // For each tag set the children of tag
    return new BurstChartData();
  }

  async getDirectedChartData(discussionId: Types.ObjectId): Promise<DirectedChartData> {
    // Get the directed chart data
    return new DirectedChartData(
      {
        trendingUp: {
          tag: {
            name: 'Nuclear',
            count: 13,
            pastDays: [
              {
                date: new Date(),
                count: 8
              },
              {
                date: new Date(),
                count: 5
              }
            ]
          }
        },
        trendingDown: {
          tag: {
            name: 'iPhone',
            count: 3,
            pastDays: [
              {
                date: new Date(),
                count: 2
              },
              {
                date: new Date(),
                count: 1
              }
            ]
          }
        },
        random: {
          tag: {
            name: 'towson',
            count: 6,
            pastDays: [
              {
                date: new Date(),
                count: 1
              },
              {
                date: new Date(),
                count: 4
              },
              {
                date: new Date(),
                count: 1
              }
            ]
          }
        }
      }
    );
  }


  async getPostsAndCommentsFromTop(post: any) {
    const comments = await this.postModel.find({ comment_for: post._id }).sort({ date: -1}).populate('userId', ['f_name', 'l_name', 'email', 'username']).lean();
    const reactions = await this.reactionModel.find({ postId: post._id }).populate('userId', ['f_name', 'l_name', 'email', 'username', 'profilePicture']).lean();
    const freshComments = [];
    if(comments.length) {
      for await(const comment of comments) {
        const post = await this.getPostsAndCommentsFromTop(comment);
        freshComments.push(post);
      }
    }
    let newPost = { ...post, user: post.userId, reactions: reactions, comments: freshComments };
    delete newPost.userId;
    return newPost;
  }
}


