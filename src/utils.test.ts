import { getPlural, secondsToHm } from './utils';

test('plural of 1 minute to equal "minute" label', () => {
  expect(getPlural(1, 'minute')).toBe('minute');
});

test('plural of 3 minutes to equal "minutes" label', () => {
  expect(getPlural(3, 'minute')).toBe('minutes');
});

test('secondsToHm of 240 seconds to equal "4min"', () => {
  expect(secondsToHm(240)).toBe('4min');
});

test('secondsToHm of 60000 seconds to equal "16hr40min"', () => {
  expect(secondsToHm(60000)).toBe('16hr40min');
});

test('secondsToHm of 60000 seconds with "biggest" type to equal "16hr"', () => {
  expect(secondsToHm(60000, { type: 'biggest' })).toBe('16hr');
});

test('secondsToHm of 240 seconds with "minutes" label to equal "4 minutes"', () => {
  expect(secondsToHm(240, { label: { minutes: ' minutes' } })).toBe(
    '4 minutes'
  );
});
