const { expect } = require('chai');
const proxyquire = require('proxyquire');
const { stub } = require('sinon');

const breakroomChannelFixture = require('../_fixtures/channel-breakroom');
const sfChannelFixture = require('../_fixtures/channel-sf');

const mockResponse = [ [
  breakroomChannelFixture,
  sfChannelFixture
] ];

const fetchAllChannels = () => Promise.resolve(mockResponse);

const getSubscribedChannels = proxyquire
  .noCallThru()
  .load('../utils/get-subscribed-channels', {
    './fetch-all-channels': fetchAllChannels
  });

describe('utils/getSubscribedChannels()', () => {
  it('fetches all subscribed channels from the API', async () => {
    const webClient = stub();
    const result = await getSubscribedChannels(webClient);
    expect(Object.keys(result)).to.deep.equal([
      breakroomChannelFixture.id,
      sfChannelFixture.id
    ]);
  });
});
