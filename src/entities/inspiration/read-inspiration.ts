import { Inspiration } from "./inspiration";

export class InspirationReadResponse {
    posting: {
        "category": string,
        "categoryIcon": string,
        "inspirations": Inspiration[]
    }[];
    responding: {
        "category": string,
        "categoryIcon": string,
        "inspirations": Inspiration[]
    }[];
    synthesizing: {
        "category": string,
        "categoryIcon": string,
        "inspirations": Inspiration[]
    }[];
}