import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

/**
 * Returns a MongoDB [ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/).
 *
 * @example
 * faker.database.fakeMongoId() // ObjectId('e175cac316a79afdd0ad3afb')
 *
 */
export const fakeMongoId = (): Types.ObjectId =>
  new Types.ObjectId(faker.database.mongodbObjectId());

export default {
  ...faker,
  database: {
    fakeMongoId: fakeMongoId,
    mongodbObjectId: faker.database.mongodbObjectId,
  },
};
