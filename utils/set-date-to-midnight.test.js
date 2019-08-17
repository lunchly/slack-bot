import test from 'ava';

const setDateToMidnight = require('./set-date-to-midnight');

test('it sets the date to midnight', t => {
  const date = new Date('July 17, 1969 13:32:00 GMT-4');
  setDateToMidnight(date);
  t.is(date.getHours(), 0);
});
