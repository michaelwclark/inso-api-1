export class Reaction {
    public id: string;
    public userId: string;
    public postId: string;
    public reaction: string;
    
    constructor(partial: Partial<Reaction>) {
        Object.assign(this, partial);
    }
}
