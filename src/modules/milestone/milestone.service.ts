
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Milestone, MilestoneDocument } from 'src/entities/milestone/milestone';
import { User, UserDocument } from 'src/entities/user/user';

@Injectable()
export class MilestoneService {

    public validTypes = ["system achievement", "system progress", "recognition"];
    public validSystemAchievements = ["1st Post", "Use Post Inspiration", "Comment Received on Post", "1st Upvote", "Perfect Score", "Discussion Created"];
    public validSystemProgress = [ 
        "5th Post",
        "10th Post",
        "50th Post",
        "100th Post",
        "1000th Post",
        "5th Use of Post Inspiration",
        "10th Use of Post Inspiration",
        "50th Use of Post Inspiration",
        "100th Use of Post Inspiration",
        "1000th Use of Post Inspiration",
        "5th Upvote",
        "10th Upvote",
        "50th Upvote",
        "100th Upvote",
        "1000th Upvote",
        "5th Reaction",
        "10th Reaction",
        "100th Reaction",
        "1000th Reaction",
        "5th Perfect Score",
        "10th Perfect Score",
        "100th Perfect Score",
        "1000th Perfect Score",
        "5th Discussion Created",
        "10th Discussion Created",
        "50th Discussion Created",
        "100th Discussion Created",
        "1000th Discussion Created"
    ];
    constructor(
        @InjectModel(Milestone.name) private milestoneModel: Model<MilestoneDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createMilestoneForUser(
        userId: Types.ObjectId,
        type: string,
        milestoneName: string,
        info: { discussionId: Types.ObjectId, postId: Types.ObjectId, date }
    ) {
        // See the milestone is a valid type
        if(!this.validTypes.includes(type)) {
            throw new HttpException('The type is not a valid milestone type', HttpStatus.BAD_REQUEST);
        }
        if(type === 'system achievement') {
            if(!this.validSystemAchievements.includes(milestoneName)) {
                throw new HttpException('The milestone is not valid for a system achievement', HttpStatus.BAD_REQUEST);
            }
        }
        const milestone = new this.milestoneModel({
            userId: userId,
            type: type,
            date: new Date(),
            milestone: milestoneName,
            info: info
        });
        return await milestone.save();
    }

    getMilestoneForUser(
        userId: Types.ObjectId,
        type: string,
        milestoneName: string,
    ) {

    }

    async checkUserMilestoneProgress(userId: Types.ObjectId) {
        // Check what progress milestones the user has achieved 
        const milestones = await this.milestoneModel.find({userId: userId});

        // See if they have achieved any new ones
        const newMilestones = [];
        // Add those to the database if they have
        for await(let newMilestone of newMilestones) {
            const milestone = new this.milestoneModel({
                userId: userId,
                type: newMilestone.type,
                date: new Date(),
                milestone: newMilestone.milestone,
                info: newMilestone.info
            });
            return await milestone.save();
        }
    }

    getMilestonesForUser(
        userId: Types.ObjectId
    ) {

    }

    getPossibleMilestones() {

    }

}