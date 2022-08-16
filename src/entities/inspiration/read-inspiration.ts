import { Inspiration } from "./inspiration";

export class InspirationReadResponse {
    posting: {
        "ask_something": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "connect_something": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "create_something": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "share_something": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "start_something": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        }
    };
    responding: {
        "add": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "answer": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "ask": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "evaluate": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "react": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        }
    }
    synthesizing: {
        "connections": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "tags": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        },
        "threads": {
            "category": string,
            "categoryIcon": string,
            "inspirations": Inspiration[]
        }
    }
}