import faker from 'test/faker';
import { Setting } from './setting';
import { SettingsCreateDTO } from './create-setting';

export function makeFakeSettingsCreateDTO(
  setting: Partial<SettingsCreateDTO> = {},
): SettingsCreateDTO {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.mongoObjectId()],
    score: faker.database.mongoObjectId(),
    calendar: faker.database.mongoObjectId(),
    ...setting,
  };
}

export function makeFakeSettingsCreateDTOPlain(setting: any = {}) {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.mongoObjectIdString()],
    score: faker.database.mongoObjectIdString(),
    calendar: faker.database.mongoObjectIdString(),
    ...setting,
  };
}

export function makeFakeSettingsCreateDTOPlain(setting: any = {}) {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.mongodbObjectId()],
    score: faker.database.mongodbObjectId(),
    calendar: faker.database.mongodbObjectId(),
    ...setting,
  };
}

export function makeFakeSettingPayload(
  setting: Partial<Setting> = {},
): Setting {
  return {
    starter_prompt: faker.lorem.words(3),
    post_inspirations: [faker.database.mongoObjectId()],
    score: faker.database.mongoObjectId(),
    calendar: faker.database.mongoObjectId(),
    userId: faker.database.mongoObjectId(),
    ...setting,
  };
}
