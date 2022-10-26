import faker from 'test/faker';
import { Setting } from './setting';
import { SettingsCreateDTO } from './create-setting';

export function makeFakeSettingsCreateDTO(
  setting: Partial<SettingsCreateDTO> = {},
): SettingsCreateDTO {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.fakeMongoId()],
    score: faker.database.fakeMongoId(),
    calendar: faker.database.fakeMongoId(),
    ...setting,
  };
}

export function makeFakeSettingPayload(
  setting: Partial<Setting> = {},
): Setting {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.fakeMongoId()],
    score: faker.database.fakeMongoId(),
    calendar: faker.database.fakeMongoId(),
    userId: faker.database.fakeMongoId(),
    ...setting,
  };
}
