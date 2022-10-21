import { makeInsoId } from './generateInsoCode';

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
