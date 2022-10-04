import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Discussion, DiscussionDocument } from "src/entities/discussion/discussion";
import { DiscussionReadDTO } from "src/entities/discussion/read-discussion";
import { DiscussionPost, DiscussionPostDocument } from "src/entities/post/post";

@Injectable()
export class DiscussionService{
    constructor(
        @InjectModel(Discussion.name) private discussionModel: Model<DiscussionDocument>,
        @InjectModel(DiscussionPost.name) private discussionPostModel: Model<DiscussionPostDocument>
    ){}

    async returnAllDiscussions(){
        const discussions = await this.discussionModel.find({});
        return discussions;
    }
}