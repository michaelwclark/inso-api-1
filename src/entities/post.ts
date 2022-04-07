export class Post {
    public id: string;
    public userId: string;
    public discussionId: string;
    public draft: boolean;
    public date: Date;
    public tags: string [];
    public comment_for: string;
    public post: string;

    constructor(partial: Partial<Post>) {
        Object.assign(this, partial);
    }
}
