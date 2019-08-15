import test from 'ava';
import initialState from './initial-state';

test('it exports an object to use as the initial state', t => {
  t.deepEqual(Object.keys(initialState), [
    'clients',
    'endpoints',
    'sites',
    'subscribedChannels'
  ]);
});
