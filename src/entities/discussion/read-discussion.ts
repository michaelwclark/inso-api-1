import { Date } from "mongoose";

export class DiscussionReadDTO {
    
  public _id: string;
  public insoCode: string;
  public name: string;
  public created: string;
  public archived: string;

  public tags: {
    tag: string;
    count: number;
  } [];

  public settings: {
    _id: string;
    starter_prompt: string;
    post_inspirations: {
      _id: string;
      type: string;
      instructions: string;
      outline: [{
        header: string;
        prompt: string;
      }]
    };
    scores: {
      _id: string;
      type: string;
      total: number;
      posts_made: {
        max_points: number;
        required: number;
      };
      active_days: {
        max_points: number;
        required: number;
      },
      comments_received: {
        max_points: number;
        required: number;
      },
      post_inspirations: {
        selected: number;
        max_points: number;
      },
      criteria: {
        max_points: number;
        criteria: string;
      }[]
    };
    calendar: {
      _id: string;
      open: string;
      close: string;
    };
  };

  public facilitators: {
      _id: string;
      username: string;
      f_name: string;
      l_name: string;
  } [];

  public poster: {
      _id: string;
      username: string;
      f_name: string;
      l_name: string;
  };

  public participants:{
    user: string,
    joined: string,
    muted: string,
    grade: string
  } [];

  public posts: {
      _id: string;
      user: {
        _id: string;
        username: string;
        f_name: string;
        l_name: string;
      }
      draft: boolean;
      date: string;
      tags: string [];
      post: string;
      comments: [];
  } [];
  
  constructor(partial: any) {
    if(partial) {
      this._id = partial._id;
      this.insoCode = partial.insoCode;
      this.name = partial.name;
      this.created = partial.created;
      this.archived = partial.archived;

      // Set the tags
      if(partial.tags) {
        this.tags = partial.tags.map(tag => {
          return {
            tag: tag.tag,
            count: tag.count
          }
        })
      }

      // Set the settings
      if(partial.settings) {
        this.settings = {
          _id: partial.settings._id,
          starter_prompt: partial.settings.starter_prompt,
          post_inspirations: partial.post_inspirations,
          scores: partial.settings.score ? {
            _id: partial.settings.score._id,
            type: partial.settings.score.type,
            total: partial.settings.score.total,
            posts_made: partial.settings.score.posts_made ? {
              max_points: partial.settings.score.posts_made.max_points,
              required: partial.settings.score.posts_made.required,
            } : null,
            active_days: partial.settings.score.active_days ? {
              max_points: partial.settings.score.active_days.max_points,
              required: partial.settings.score.active_days.required
            } : null,
            comments_received: partial.settings.score.comments_received ? {
              max_points: partial.settings.score.comments_received.max_points,
              required: partial.settings.score.comments_received.required
            } : null,
            post_inspirations: partial.settings.score.post_inspirations ? {
              max_points: partial.settings.score.post_inspirations.max_points,
              selected: partial.settings.score.post_inspirations.selected
            } : null,
            criteria: partial.settings.score.criteria ? partial.settings.score.criteria.map(criteria => {
              return {
                max_points: criteria.max_points,
                criteria: criteria.criteria
              }
            }) : null,
          } : null,
          calendar: partial.settings.calendar !== null ? {
            _id: partial.settings.calendar._id,
            open: new Date(partial.settings?.calendar.open).toString(),
            close: new Date(partial.settings?.calendar.close).toString(),
          }: null
        };
      }

      // Set the poster
      this.poster = {
        _id: partial.poster._id,
        username: partial.poster.username,
        f_name: partial.poster.f_name,
        l_name: partial.poster.l_name
      }

      // Map the facilitators
      this.facilitators = partial.facilitators ? partial.facilitators.map(facilitator => {
        return {
          _id: facilitator._id,
          username: facilitator.username,
          f_name: facilitator.f_name,
          l_name: facilitator.l_name
        }
      }) : null

      // Map the participants
      this.participants = partial.participants ? partial.participants.map(participant => {
        return {
          user: participant.user,
          joined: participant.joined,
          muted: participant.muted,
          grade: participant.grade
        }
      }) : null

      // Map the posts 
      this.posts = partial.posts;
    }
  }
}