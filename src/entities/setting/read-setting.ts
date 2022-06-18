export class SettingsReadDTO{
    
    public id: string;
    public starterPrompt: string;

   public postInsnspiration: {
        id: string;
        type: string;
        instructions: string;
        outline: [{
            header: string;
            prompt: string;
        }]
    };
    public scores: {
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
    public calendar: {
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

    constructor(partial: Partial<SettingsReadDTO>) {
        Object.assign(this, partial);
    }
}