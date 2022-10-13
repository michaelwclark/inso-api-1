import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { DiscussionReadDTO } from "src/entities/discussion/read-discussion";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";

@Injectable()
export class DiscussionService {
    constructor(
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
        @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>
    ){}

    async returnAllDiscussions(val: string){
        const discussions = await this.discussionModel.find({})
            .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
            .populate('poster', ['f_name', 'l_name', 'email', 'username'])
            .populate({ path: 'settings', populate: [{ path: 'calendar'}, { path: 'score'}, { path: 'post_inspirations'}]}).lean();
        return discussions;
    }
}