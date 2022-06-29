export class ReadInstructions {
    posting: number;
    responding: number;
    synthesizing: number;

    constructor(partial: Partial<ReadInstructions>) {
        Object.assign(this, partial);
    }
}