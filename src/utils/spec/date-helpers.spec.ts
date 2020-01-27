import { daysBetween } from '../date-helpers';

describe('dateHelpers', () => {
  test('daysBetween', () => {
    const dateA = new Date('2020-01-01');
    const dateB = new Date('2020-01-03');

    expect(daysBetween(dateA, dateB)).toEqual(2);
  });
});
