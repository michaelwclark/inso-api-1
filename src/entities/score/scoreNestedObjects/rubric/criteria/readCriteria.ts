export class ReadCriteria {

    description: string;
    max: number;
   
   constructor(partial: Partial<ReadCriteria>) {
       Object.assign(this, partial);
   }
   
   }