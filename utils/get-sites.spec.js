const { expect } = require('chai');
const proxyquire = require('proxyquire');

const sfChannelFixture = require('../_fixtures/channel-sf');

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

describe('utils/getSites()', () => {
  it('returns the expected sites object', () => {
    const sites = getSites(mockSites);
    expect(Object.keys(sites)).to.deep.equal([ 'phoenix', 'sf' ]);
  });
});
