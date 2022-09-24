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
const { removeStopwords } = require('stopword');
var count = require('count-array-values');

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

        const participants = [];
        for await(let participant of found.participants) {
          const part = await this.userModel.findOne({ _id: participant.user }).lean();
          delete part.password;
          delete part.contact;
          participants.push({ ...part, muted: participant.muted });
        }
        found.participants = participants;

        query = new AnalyticsQueryDto(query);
        let chord = new ChordChartData();
        let burst = new BurstChartData();
        let directedChart = new DirectedChartData();

        if(query.chord) {
            chord = await this.getChordChartData(found);
        }

        if(query.burst) {
            burst = await this.getBurstChartData(found);
        }

        if(query.directed) {
            directedChart = await this.getDirectedChartData(found);
        }
    return new ChartData({ chordChartData: chord, burstChartData: burst, directedChartData: directedChart })
  }

  /** PRIVATE FUNCTIONS */

  async getChordChartData(discussion: any): Promise<ChordChartData> {
    // Get the tags for a discussion and all of the people that have used them
    const dbPosts = await this.postModel.find({ discussionId: new Types.ObjectId(discussion._id), draft: false, comment_for: null }).populate('userId', ['f_name', 'l_name', 'email', 'username','profilePicture']).sort({ date: -1 }).lean();
    const posts = [];
    for await(const post of dbPosts) {
      const postWithComments = await this.getPostsAndCommentsFromTop(post);
      posts.push(postWithComments);
    }
    const tags = await this.getTags(posts, discussion.tags);
    // Build the array of people that used those specific tags
    console.log(discussion.participants);
    // Build the 2D array 
    const participantArray = discussion.participants.map(participant => {
      return participant.f_name + " " + participant.l_name;
    });
    console.log(participantArray);
    const value = new ChordChartData();
    return new ChordChartData({ keys: ['Josh', 'Paige', 'Nick'], data: [ [0, 3, 1], [3, 0, 2], [1, 2, 0] ]});
  }

  async getBurstChartData(discussion: any): Promise<BurstChartData> {
    // Get the top 5 tags for the a discussion and all of the people that have used them as top level comments
    // Set the flare for the discussion as the discussion name
    // For each tag set the children of tag
    return new BurstChartData();
  }

  async getDirectedChartData(discussion: any): Promise<DirectedChartData> {
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

  async getTagsForUser(posts: any, tags: string[], user: any) {
    let tagsArray = [];
    if(posts.length > 0){

      let strings = [];
      let postElement;
      let postNoStopWords;
      let temp;

      for(var i = 0; i < posts.length; i++){
        // Iterate the keys later
        let vars = '';
        // Get the values in the outline 
        if(posts[i].post.outline) {
          const outline = posts[i].post.outline;
          for (var key in outline) {
            vars = vars + ' ' + posts[i].post.outline[key];
          }
        }
        const text = posts[i].post.post + vars;
        // Remove any html tags
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
        postElement = cleanText.split(' ');
        // TODO: Change the tags here
        postNoStopWords = removeStopwords(postElement);
        temp = postNoStopWords.join(' ');
        console.log(temp);
        console.log(posts[i].user);
        strings.push(temp)
      }

      var allPosts = strings.join(' ');
      allPosts = allPosts.split('.').join(''); // remove periods from strings
      allPosts = allPosts.split(',').join(''); // remove commas from strings
      allPosts = allPosts.split('!').join(''); // remove explanation points from strings
      allPosts = allPosts.split('?').join(''); // remove question marks from strings
      allPosts = allPosts.split('#').join(''); // remove existing tag signifier from array

      var newArray = allPosts.split(' ');
      newArray = newArray.map( element => element = element.toLowerCase() );
      newArray = newArray.filter(function(x) {
        return x !== ''
      });

      tagsArray = count(newArray, 'tag');
      
      const stringTags = tagsArray.map(tag => { return tag.tag});
      
      stringTags.forEach((tag, i) => {
        if(tags.includes(tag)) {
          tagsArray = [...tagsArray.slice(i), ...tagsArray.slice(0, i)]
        }
      })
    }
    return tagsArray;
  }

  async getTags(posts: any, tags: string[]) {
    let tagsArray = [];
    if(posts.length > 0){

      let strings = [];
      let postElement;
      let postNoStopWords;
      let temp;

      for(var i = 0; i < posts.length; i++){
        // Iterate the keys later
        let vars = '';
        // Get the values in the outline 
        if(posts[i].post.outline) {
          const outline = posts[i].post.outline;
          for (var key in outline) {
            vars = vars + ' ' + posts[i].post.outline[key];
          }
        }
        const text = posts[i].post.post + vars;
        // Remove any html tags
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
        postElement = cleanText.split(' ');
        // TODO: Change the tags here
        postNoStopWords = removeStopwords(postElement);
        temp = postNoStopWords.join(' ');
        strings.push(temp)
      }

      var allPosts = strings.join(' ');
      allPosts = allPosts.split('.').join(''); // remove periods from strings
      allPosts = allPosts.split(',').join(''); // remove commas from strings
      allPosts = allPosts.split('!').join(''); // remove explanation points from strings
      allPosts = allPosts.split('?').join(''); // remove question marks from strings
      allPosts = allPosts.split('#').join(''); // remove existing tag signifier from array

      var newArray = allPosts.split(' ');
      newArray = newArray.map( element => element = element.toLowerCase() );
      newArray = newArray.filter(function(x) {
        return x !== ''
      });

      tagsArray = count(newArray, 'tag');
      
      const stringTags = tagsArray.map(tag => { return tag.tag});
      
      stringTags.forEach((tag, i) => {
        if(tags.includes(tag)) {
          tagsArray = [...tagsArray.slice(i), ...tagsArray.slice(0, i)]
        }
      })
    }
    return tagsArray;
  }
}


