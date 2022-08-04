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
  };
  public settings: {
    _id: string;
    starter_prompt: string;
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

  public participants:{
    user: string,
    joined: string,
    muted: string,
    grade: string
  } [];
  
  constructor(partial: any) {
    if(partial.settings?.calendar)
      this.settings = partial.settings;
      this.settings.calendar.open = new Date(partial.settings.calendar.open).toString();
      this.settings.calendar.close = new Date(partial.settings.calendar.close).toString();
  }
}