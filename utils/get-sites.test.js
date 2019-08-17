import test from 'ava';
import proxyquire from 'proxyquire';

import sfChannelFixture from '../_fixtures/channel-sf';

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
  sfChannelFixture
];

test('TODO: add unit tests', t => {
  t.deepEqual(Object.keys(getSites(mockSites)), [ 'phoenix', 'sf' ]);
});
