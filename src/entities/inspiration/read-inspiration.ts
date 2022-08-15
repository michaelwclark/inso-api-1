import { Inspiration } from "./inspiration";

export class InspirationReadResponse {
    posting: {
        "ask_something": Inspiration[],
        "connect_something": Inspiration[],
        "create_something": Inspiration[],
        "share_something": Inspiration[],
        "start_something": Inspiration[]
    };
    responding: {
        "add": Inspiration[],
        "answer": Inspiration[],
        "ask": Inspiration[],
        "evaluate": Inspiration[],
        "react": Inspiration[]
    }
    synthesizing: {
        "connections": Inspiration[],
        "tags": Inspiration[],
        "threads": Inspiration[]
    }
}