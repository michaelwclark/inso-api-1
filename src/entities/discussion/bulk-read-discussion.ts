export class BulkReadDiscussionDTO {
    public _id: string;
    public insoCode: string;
    public name: string;
    public created: string;
    public archived: string;
    public poster: {
        _id: string;
        username: string;
        f_name: string;
        l_name: string;
    };
    public participants: {
        _id: string,
        username: string,
        f_name: string,
        l_name: string
    } [];

    constructor(partial: Partial<BulkReadDiscussionDTO>) {
        Object.assign(this, partial);
        // Map the poster to what we want to return
        this.poster = {
          _id: partial.poster._id,
          username: partial.poster.username,
          f_name: partial.poster.f_name,
          l_name: partial.poster.l_name
        };
    }
}