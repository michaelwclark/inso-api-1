export class Grade {
    public id: string;
    public discussionId: string;
    public userId: string;
    public grade: number;
    public maxScore: number;
    public comment: string;
    public facilitator: string;
    
    constructor(partial: Partial<Grade>) {
        Object.assign(this, partial);
    }
}
