import { criteriaObject } from "./criteria/criteriaObject";

export class ReadRubric {

    max: number;
    criteria: criteriaObject;
   
   constructor(partial: Partial<ReadRubric>) {
       Object.assign(this, partial);
   }
   
   }