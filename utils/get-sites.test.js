import test from 'ava';

import channelFixture from '../_fixtures/channel.fixture';
import getSites from './get-sites';

const mockSites = [
  channelFixture
];

test('TODO: add unit tests', t => {
  t.pass();

  t.deepEqual(Object.keys(getSites(mockSites)), ['sf', 'sunnyvale']);
});
