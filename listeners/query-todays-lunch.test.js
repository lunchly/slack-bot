import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'ava';

import channelFixture from '../_fixtures/channel.fixture';

const stubAction = sinon.stub().resolves({});
const stubLogger = { debug: sinon.stub() };
const stubTracker = { track: sinon.stub() };

const mockSubscribedChannels = { CD93G4JMP: channelFixture };
const queryTodaysLunch = proxyquire
  .noCallThru()
  .load('./query-todays-lunch', {
    '../logger': stubLogger,
    '../tracker': stubTracker
  });

const getAppState = () => {
  return {
    clients: {
      rtm: {
        activeUserId: '999',
        on: sinon.stub()
      }
    },
    subscribedChannels: mockSubscribedChannels
  };
};

const mockValidMessage = {
  channel: channelFixture.id,
  subtype: 'derp',
  text: '!lunch',
  user: '10001'
};

test('it subscribes to the RTM client\'s "message" events', t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  t.deepEqual(rtm.on.args[0][0], 'message');
});

test('it fires a tracking event for valid interaction messages', async t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  const messageHandler = rtm.on.args[0][1];
  await messageHandler(mockValidMessage);
  t.deepEqual(stubTracker.track.args, [
    [
      'New interaction detected.',
      {
        channel: mockValidMessage.channel,
        listener: 'QUERY_CHANNEL_LUNCH',
        text: mockValidMessage.text
      }
    ]
  ]);
});
