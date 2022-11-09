import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import emojis from './emojis';
/**
 * Returns a MongoDB [ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/).
 *
 * @example
 * faker.database.mongoObjectId() // ObjectId('e175cac316a79afdd0ad3afb')
 *
 */
export const mongoObjectId = (): Types.ObjectId =>
  new Types.ObjectId(faker.database.mongodbObjectId());

const randomNumberBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomEmoji = (): string => {
  const emojiKeys = Object.keys(emojis);
  const randomIndex = randomNumberBetween(0, emojiKeys.length - 1);
  return emojis[emojiKeys[randomIndex]];
};

export default {
  ...faker,
  emoji: randomEmoji,
  database: {
    mongoObjectId: mongoObjectId,
    // Saves me from shooting myself in the foot repeatedly
    mongoObjectIdString: faker.database.mongodbObjectId,
    mongodbObjectId: faker.database.mongodbObjectId,
  },
};
