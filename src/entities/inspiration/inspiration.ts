export class Outline {
    public header: string;
    public prompt: string;

    constructor(partial: Partial<Outline>) {
        Object.assign(this, partial);
    }
}

export class Inspiration {
    public id: string;
    public type: string;
    public instructions: string;
    public outline: Outline [];

    constructor(partial: Partial<Inspiration>) {
        Object.assign(this, partial);
    }
}
