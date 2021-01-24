import * as R from 'ramda';

export const normalizeParsedText = R.unless(
  R.isNil,
  R.pipe(
    R.replace(/[ ]{2,}/g, ' '),
    R.replace(/[\n]{2,}/g, '\n'),
    R.trim,
    R.when<string, string>(R.isEmpty, R.always(null)),
  ),
);

export const normalizeISBN = R.unless(
  R.isNil,
  R.pipe(
    R.replace(/-/g, ''),
    R.trim,
  ),
);

export const normalizeURL = R.when(
  R.startsWith('//'),
  R.concat('https:'),
);

export function normalizePrice(str: string) {
  const [, value, currency] = R.match(/(\d+[.,]\d+)\s*(\S+)?/, str);

  if (R.isNil(value) || R.isNil(currency))
    return null;

  return {
    price: Number.parseFloat(value.replace(',', '.')), // it should be decimal?
    currency: currency.toLowerCase(),
  };
}