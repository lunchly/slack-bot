import test from 'ava';
import proxyquire from 'proxyquire';

import channelFixture from '../_fixtures/channel.fixture';

const sitesFixture = [ {
  channel: 'phoenix',
  company_id: '00000000000000000000000000000000'
}, {
  channel: 'sf',
  company_id: '00000000000000000000000000000000'
} ];

const getSites = proxyquire
  .noCallThru()
  .load('./get-sites', {
    '../sites.json': sitesFixture
  });

const mockSites = [
  channelFixture
];

test('TODO: add unit tests', t => {
  t.deepEqual(Object.keys(getSites(mockSites)), [ 'phoenix', 'sf' ]);
});
