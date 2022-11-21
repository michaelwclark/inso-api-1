/**
 * Code below adjusted from: https://www.npmjs.com/package/@agarimo/gibberish
 */

/**
 * Gets the values for analysis
 * @param tokens Array of tokens to analyze
 * @returns An analysis object for the text
 */
function getMeasures(tokens: string[]) {
  const freqs = {
    length: 0,
    words: tokens.length,
    vowels: 0,
    consonants: 0,
    uniqueChars: 0,
    vowelFreq: 0,
    consonantFreq: 0,
    uniqueFreq: 0,
    wordCharFreq: 0,
    vowelOverConsonant: 0,
  };
  const vowels = { a: 1, e: 1, i: 1, o: 1, u: 1, y: 1 };
  const chars = {};
  for (let i = 0; i < tokens.length; i += 1) {
    freqs.length += tokens[i].length;
    [...tokens[i]].forEach((char) => {
      if (vowels[char]) {
        freqs.vowels += 1;
      } else {
        freqs.consonants += 1;
      }
      chars[char] = 1;
    });
  }
  freqs.uniqueChars = Object.keys(chars).length;
  freqs.vowelFreq = freqs.vowels / freqs.length;
  freqs.consonantFreq = freqs.consonants / freqs.length;
  freqs.uniqueFreq = freqs.uniqueChars / freqs.length;
  freqs.wordCharFreq = freqs.words / freqs.length;
  freqs.vowelOverConsonant =
    freqs.consonants > 0 ? freqs.vowels / freqs.consonants : 0;
  return freqs;
}

/**
 *
 * @param value The value we are testing
 * @param lower the lower bound
 * @param upper the upper bound
 * @returns the deviation or 0 if the value falls between the two bounds
 */
function getDeviation(value: number, lower: number, upper: number) {
  if (value < lower) {
    const logDelta = Math.log(lower - value);
    return logDelta === 0 ? 1 : Math.log(Math.abs(lower)) / logDelta;
  }
  if (value > upper) {
    const logDelta = Math.abs(Math.log(value - upper));
    if (logDelta === 0) {
      return 1;
    }
    return Math.log(upper) / logDelta;
  }
  return 0;
}

export function getGibberishScore(text: string) {
  // Three characters seems to be the tipping point for good results
  if (text.length < 3) {
    return 0;
  }
  const normalize = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const split = (str) => str.split(/[\s,.!?;:([\]'"¡¿)/]+/);

  const tokens = split(normalize(text.slice(0, 32))).filter((x) => x);

  const measures = getMeasures(tokens);

  const deviations = {
    vowel: getDeviation(measures.vowelFreq, 0.35, 0.7),
    unique: getDeviation(measures.uniqueFreq, 0.2, 0.9),
    wordChar: getDeviation(measures.wordCharFreq, 0.15, 0.4),
  };
  return Math.min(
    1,
    deviations.unique + deviations.vowel + deviations.wordChar,
  );
}

/**
 * Determines if text is gibberish
 * @param text The text to test for gibberish
 * @returns a boolean value. True if the text is gibberish, false if it is not.
 */
export function isGibberish(text: string) {
  const val = getGibberishScore(text);
  return val > 0.25;
}
