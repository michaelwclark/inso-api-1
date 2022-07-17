import { Date } from "mongoose";

export class DiscussionReadDTO {
    
  public _id: string;
  public insoCode: string;
  public name: string;
  public created: string;
  public archived: string;
  public settings: {
    _id: string;
    starterPrompt: string;
    postInspiration: {
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
      instructions: {
        posting: number;
        responding: number;
        synthesizing: number;
      };
      interactions: {
        max: number;
      };
      impact: {
        max: number;
      };
      rubric: {
        max: number;
        criteria: [{
          description: string;
          max: number;
        }]
      }
    };
    calendar: {
      id: string;
      open: Date;
      close: Date;
      posting: {
        open: Date;
        close: Date;
      };
      responding: {
        open: Date;
        close: Date;
      };
      synthesizing: {
        open: Date;
        close: Date;
      }
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
  } [];
  
  constructor(partial: Partial<DiscussionReadDTO>) {
      Object.assign(this, partial);
      // Map the users to what we want
      this.poster = {
        _id: partial.poster._id,
        username: partial.poster.username,
        f_name: partial.poster.f_name,
        l_name: partial.poster.l_name
      };
      this.facilitators = partial.facilitators.map(fac => {
        return {
          _id: fac._id,
          username: fac.username,
          f_name: fac.f_name,
          l_name: fac.l_name
        }
      });
  }
}