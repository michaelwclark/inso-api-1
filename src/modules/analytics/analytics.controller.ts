import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BurstChartData,
  ChartData,
  ChordChartData,
  DirectedChartData,
} from 'src/entities/chart-data/chart-data';
import {
  Discussion,
  DiscussionDocument,
} from 'src/entities/discussion/discussion';

import { DiscussionPost, DiscussionPostDocument } from 'src/entities/post/post';
import { Reaction, ReactionDocument } from 'src/entities/reaction/reaction';
import { User, UserDocument } from 'src/entities/user/user';
import { AnalyticsQueryDto } from './types/query';
import { removeStopwords } from 'stopword';
import count from 'count-array-values';

@Controller()
export class AnalyticsController {
  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DiscussionPost.name)
    private postModel: Model<DiscussionPostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}

  @Get('discussion/:discussionId/analytics')
  async getAnalytics(
    @Param('discussionId') discussionId: string,
    @Query() query: AnalyticsQueryDto,
  ) {
    if (!Types.ObjectId.isValid(discussionId)) {
      throw new HttpException(
        'DiscussionId is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
    const discussion = new Types.ObjectId(discussionId);

    const found = await this.discussionModel
      .findOne({ _id: discussion })
      .populate('settings', ['calendar'])
      .lean();

    if (!found) {
      throw new HttpException(
        'Discussion does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    const participants = [];
    for await (const participant of found.participants) {
      const part = await this.userModel
        .findOne({ _id: participant.user })
        .lean();
      delete part.password;
      delete part.contact;
      participants.push({ ...part, muted: participant.muted });
    }
    found.participants = participants;

    query = new AnalyticsQueryDto(query);
    const chord = new ChordChartData();
    let burst = new BurstChartData();
    const directedChart = new DirectedChartData();

    if (query.burst === true) {
      burst = await this.getBurstChartData(found);
    }

    // if (query.directed === true) {
    //   directedChart = await this.getDirectedChartData(found);
    // }
    return new ChartData({
      chordChartData: chord,
      burstChartData: burst,
      directedChartData: directedChart,
    });
  }

  /** PRIVATE FUNCTIONS */

  /**
   * Generate data for burst chart for a discussion
   * @param discussion The discussion we want to get burst chart data for
   * @returns BurstChartData
   */
  async getBurstChartData(discussion: any): Promise<BurstChartData> {
    const dbPosts = await this.postModel
      .find({
        discussionId: new Types.ObjectId(discussion._id),
        draft: false,
        comment_for: null,
      })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .sort({ date: -1 })
      .lean();
    const posts = [];
    for await (const post of dbPosts) {
      const postWithComments = await this.getBurstData(post);
      posts.push(postWithComments);
    }
    return new BurstChartData({ flare: 'post threads', children: posts });
  }

  async getDirectedChartData(discussion: any): Promise<DirectedChartData> {
    // Get the tags for the discussion
    console.log(discussion._id);
    // const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // const dbPosts = await this.postModel
    //   .find({
    //     discussionId: new Types.ObjectId(discussion._id),
    //     draft: false,
    //     date: { $gte: sevenDaysAgo }
    //   })
    //   .populate('userId', [
    //     'f_name',
    //     'l_name',
    //     'email',
    //     'username',
    //     'profilePicture',
    //   ])
    //   .sort({ date: -1 })
    //   .lean();

    //const tags = await this.getTags(dbPosts, discussion.tags);

    // Get trending up

    // Get trending down

    // Pick a random tag

    return new DirectedChartData({});
  }

  async getPostsAndCommentsFromTop(post: any) {
    const comments = await this.postModel
      .find({ comment_for: post._id })
      .sort({ date: -1 })
      .populate('userId', ['f_name', 'l_name', 'email', 'username'])
      .lean();
    const reactions = await this.reactionModel
      .find({ postId: post._id })
      .populate('userId', [
        'f_name',
        'l_name',
        'email',
        'username',
        'profilePicture',
      ])
      .lean();
    const freshComments = [];
    if (comments.length) {
      for await (const comment of comments) {
        const post = await this.getPostsAndCommentsFromTop(comment);
        freshComments.push(post);
      }
    }
    const newPost = {
      ...post,
      user: post.userId,
      reactions: reactions,
      comments: freshComments,
    };
    delete newPost.userId;
    return newPost;
  }

  async getBurstData(post: any) {
    const comments = await this.postModel
      .find({ comment_for: post._id })
      .sort({ date: -1 })
      .populate('userId', ['f_name', 'l_name', 'email', 'username'])
      .lean();
    const freshComments = [];
    if (comments.length) {
      for await (const comment of comments) {
        const post = await this.getBurstData(comment);
        freshComments.push({
          ...comment,
          name: post.userId.f_name + ' ' + post.userId.l_name,
          children: [],
        });
      }
    }

    const newPost = {
      ...post,
      name: post.userId.f_name + post.userId.l_name,
      children: freshComments,
    };
    return newPost;
  }

  async getTagsForUser(posts: any, tags: string[]) {
    let tagsArray = [];
    if (posts.length > 0) {
      const strings = [];
      let postElement;
      let postNoStopWords;
      let temp;

      for (let i = 0; i < posts.length; i++) {
        // Iterate the keys later
        let vars = '';
        // Get the values in the outline
        if (posts[i].post.outline) {
          const outline = posts[i].post.outline;
          for (const key in outline) {
            vars = vars + ' ' + posts[i].post.outline[key];
          }
        }
        const text = posts[i].post.post + vars;
        // Remove any html tags
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, '');
        postElement = cleanText.split(' ');
        // TODO: Change the tags here
        postNoStopWords = removeStopwords(postElement);
        temp = postNoStopWords.join(' ');
        strings.push(temp);
      }

      let allPosts = strings.join(' ');
      allPosts = allPosts.split('.').join(''); // remove periods from strings
      allPosts = allPosts.split(',').join(''); // remove commas from strings
      allPosts = allPosts.split('!').join(''); // remove explanation points from strings
      allPosts = allPosts.split('?').join(''); // remove question marks from strings
      allPosts = allPosts.split('#').join(''); // remove existing tag signifier from array

      let newArray = allPosts.split(' ');
      newArray = newArray.map((element) => (element = element.toLowerCase()));
      newArray = newArray.filter(function (x) {
        return x !== '';
      });

      tagsArray = count(newArray, 'tag');

      const stringTags = tagsArray.map((tag) => {
        return tag.tag;
      });

      stringTags.forEach((tag, i) => {
        if (tags.includes(tag)) {
          tagsArray = [...tagsArray.slice(i), ...tagsArray.slice(0, i)];
        }
      });
    }
    return tagsArray;
  }

  /**
   * Gets tags for posts within a specified discussion
   * @param posts the posts in the discussion
   * @param tags the tags that fit in
   * @returns tags
   */
  async getTags(posts: any, tags: string[]) {
    let tagsArray = [];
    if (posts.length > 0) {
      const strings = [];
      let postElement;
      let postNoStopWords;
      let temp;

      for (let i = 0; i < posts.length; i++) {
        // Iterate the keys later
        let vars = '';
        // Get the values in the outline
        if (posts[i].post.outline) {
          const outline = posts[i].post.outline;
          for (const key in outline) {
            vars = vars + ' ' + posts[i].post.outline[key];
          }
        }
        const text = posts[i].post.post + vars;
        // Remove any html tags
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, '');
        postElement = cleanText.split(' ');
        // TODO: Change the tags here
        postNoStopWords = removeStopwords(postElement);
        temp = postNoStopWords.join(' ');
        strings.push(temp);
      }

      let allPosts = strings.join(' ');
      allPosts = allPosts.split('.').join(''); // remove periods from strings
      allPosts = allPosts.split(',').join(''); // remove commas from strings
      allPosts = allPosts.split('!').join(''); // remove explanation points from strings
      allPosts = allPosts.split('?').join(''); // remove question marks from strings
      allPosts = allPosts.split('#').join(''); // remove existing tag signifier from array

      let newArray = allPosts.split(' ');
      newArray = newArray.map((element) => (element = element.toLowerCase()));
      newArray = newArray.filter(function (x) {
        return x !== '';
      });

      tagsArray = count(newArray, 'tag');

      const stringTags = tagsArray.map((tag) => {
        return tag.tag;
      });

      stringTags.forEach((tag, i) => {
        if (tags.includes(tag)) {
          tagsArray = [...tagsArray.slice(i), ...tagsArray.slice(0, i)];
        }
      });
    }
    return tagsArray;
  }
}
