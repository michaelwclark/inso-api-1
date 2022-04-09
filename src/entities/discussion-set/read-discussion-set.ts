export class DiscussionSetReadDTO {
    public id: string;
    public insoCode: string;
    public name: string;
    public created: Date;
    public archived: Date;
    public facilitators: string [];
    public poster: string;
    
    constructor(partial: Partial<DiscussionSetReadDTO>) {
        Object.assign(this, partial);
    }
}