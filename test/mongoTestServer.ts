//import { MongoMemoryServer } from 'mongodb-memory-server';

//const mongodb = await MongoMemoryServer.create();
//const uri = mongodb.getUri();
//await mongodb.stop();

import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';

let mongodb: MongoMemoryServer;




