export class Setting {
    public id: string;
    public starter_prompt: string;
    public post_inspiration: string;
    public score: string;
    public calendar: string;
    
    constructor(partial: Partial<Setting>) {
        Object.assign(this, partial);
    }
}
