import { isGibberish } from './detectGarbageInputs';

describe('isGibberish', () => {
  it('should return true for gibberish of a short string', () => {
    const word = isGibberish('alkjl;a');
    expect(word).toBe(true);
  });

  it('should return true for gibberish of a super short string', () => {
    const word = isGibberish('glhy');
    expect(word).toBe(true);
  });

  it('should return true for gibberish of a long string', () => {
    const word = isGibberish('aosidjfw;elkjfonv389jknv;kab');
    expect(word).toBe(true);
  });

  it('should return false for a valid word that is short', () => {
    const word = isGibberish('valid');
    expect(word).toBe(false);
  });
});
