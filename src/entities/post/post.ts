export class DiscussionPost {
    public id: string;
    public userId: string;
    public discussionId: string;
    public draft: boolean;
    public date: Date;
    public tags: string [];
    public comment_for: string;
    public post: string;

    constructor(partial: Partial<DiscussionPost>) {
        console.log(partial)
        Object.assign(this, partial);
    }
}
