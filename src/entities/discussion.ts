export class Discussion {
    public id: string;
    public insoCode: string;
    public name: string;
    public created: Date;
    public archived: Date;
    public settingsId: string;
    public facilitators: string [];
    public poster: string;
    public set: string [];
    
    constructor(partial: Partial<Discussion>) {
        Object.assign(this, partial);
    }
}
