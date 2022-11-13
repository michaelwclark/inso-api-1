import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Discussion,
  DiscussionDocument,
} from 'src/entities/discussion/discussion';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
  ) {}

  async returnAllDiscussions() {
    const discussions = await this.discussionModel
      .find({})
      .populate('facilitators', ['f_name', 'l_name', 'email', 'username'])
      .populate('poster', ['f_name', 'l_name', 'email', 'username'])
      .populate({
        path: 'settings',
        populate: [
          { path: 'calendar' },
          { path: 'score' },
          { path: 'post_inspirations' },
        ],
      })
      .lean();
    return discussions;
  }
}
