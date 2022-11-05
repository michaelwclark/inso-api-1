import { makeInsoId, getUniqueInsoCode } from './generateInsoCode';

describe('generateInsoCode', () => {
  it('should generate a random string', () => {
    const id = makeInsoId(10);
    expect(id).toHaveLength(10);
  });

  it('should generate a random string with a different length', () => {
    const id = makeInsoId(20);
    expect(id).toHaveLength(20);
  });
});

describe('getUniqueInsoCode', () => {
  it('should generate a unique inso code', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(0),
    };
    const insoCode = await getUniqueInsoCode(model);
    expect(insoCode).toHaveLength(5);
  });

  it('should generate a unique inso code with a different length', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(0),
    };
    const insoCode = await getUniqueInsoCode(model, 10);
    expect(insoCode).toHaveLength(10);
  });

  it('should generate a unique inso code with a different length', async () => {
    const model = {
      count: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0),
    };

    const insoCode = await getUniqueInsoCode(model, 5);
    expect(insoCode).toHaveLength(5);
  });
});
