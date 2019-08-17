import proxyquire from 'proxyquire';
import { stub } from 'sinon';
import test from 'ava';

import breakroomChannelFixture from '../_fixtures/channel-breakroom';
import sfChannelFixture from '../_fixtures/channel-sf';

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

test('fetches all subscribed channels from the API', async t => {
  const webClient = stub();
  const result = await getSubscribedChannels(webClient);
  t.deepEqual(Object.keys(result), [
    breakroomChannelFixture.id,
    sfChannelFixture.id
  ]);
});
