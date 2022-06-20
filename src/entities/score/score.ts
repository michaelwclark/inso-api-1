export class Criteria {
    public description: string;
    public max: number;
}

export type ScoreDocument = Score & Document;

export class Score {
    public id: string;
    public type: string;
    public instructions: {
        posting: number,
        responding: number,
        synthesizing: number
    }
    public interactions: {
        max: number
    }
    public impact: {
        max: number
    }
    public rubric: {
        max: number,
        criteria: Criteria []
    }

    constructor(partial: Partial<Score>) {
        Object.assign(this, partial);
    }
}
