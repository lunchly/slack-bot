import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'ava';

import channelFixture from '../_fixtures/channel.fixture';

const rtm = {
  on: sinon.stub()
};

const stubAction = sinon.stub();
const stubLogger = sinon.stub();
const stubTracker = sinon.stub();

const mockSubscribedChannels = [ channelFixture ];
const queryTodaysLunch = proxyquire
  .noCallThru()
  .load('./query-todays-lunch', {
    '../logger': stubLogger,
    '../tracker': stubTracker
  });

const appState = {
  clients: { rtm },
  subscribedChannels: mockSubscribedChannels
};

test('it subscribes to the RTM client\'s "message" events', t => {
  queryTodaysLunch({ action: stubAction, appState });
  t.deepEqual(rtm.on.args[0][0], 'message');
});
