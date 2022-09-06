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
    return new ChordChartData();
  }

  async getBurstChartData(discussionId: Types.ObjectId): Promise<BurstChartData> {
    return new BurstChartData();
  }

  async getDirectedChartData(discussionId: Types.ObjectId): Promise<DirectedChartData> {
    return new DirectedChartData;
  }
}