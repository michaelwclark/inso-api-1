export class DiscussionReadDTO {
    
  public id: string;
  public insoCode: string;
  public name: string;
  public created: string;
  public archived: string;
  public setting: {
    id: string;
    starterPrompt: string;
    postInspiration: {
      id: string;
      type: string;
      instructions: string;
      outline: [{
        header: string;
        prompt: string;
      }]
    };
    scores: {
      id: string;
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
      posting: {
        open: string;
        close: string;
      };
      responding: {
        open: string;
        close: string;
      };
      synthesizing: {
        open: string;
        close: string;
      }
    };
  };
  public facilitators: {
      id: string;
      username: string;
      f_name: string;
      l_name: string;
  } [];
  public poster: {
      id: string;
      username: string;
      f_name: string;
      l_name: string;
  };
  public posts: {
      id: string;
      user: {
        id: string;
        username: string;
        f_name: string;
        l_name: string;
      }
      draft: boolean;
      date: string;
      tags: string [];
      post: string;
  } [];

  // public participants:{
  //   user: string,
  //   joined: string,
  //   muted: string,
  //   grade: string
  // }
  
  constructor(partial: Partial<DiscussionReadDTO>) {
      Object.assign(this, partial);
  }
}