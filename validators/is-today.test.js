import test from 'ava';

import isToday from './is-today';

test('it converts all object keys to camelCase', t => {
  const timestamp = new Date();
  t.truthy(isToday(timestamp));
});

