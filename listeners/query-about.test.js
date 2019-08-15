import proxyquire from 'proxyquire';
import { createSandbox } from 'sinon';
import test from 'ava';

import channelFixture from '../_fixtures/channel.fixture';

const sandbox = createSandbox();
const mockResult = { result: 'success' };
const stubAction = sandbox.stub().resolves(mockResult);
const stubLogger = { debug: sandbox.stub() };
const stubTracker = { track: sandbox.stub() };

const mockRTMClient = { activeUserId: '999', on: sandbox.stub() };
const mockSubscribedChannels = { CD93G4JMP: channelFixture };

const queryTodaysLunch = proxyquire
  .noCallThru()
  .load('./query-about', {
    '../logger': stubLogger,
    '../tracker': stubTracker
  });

const getAppState = () => {
  return {
    clients: {
      rtm: mockRTMClient
    },
    subscribedChannels: mockSubscribedChannels
  };
};

const mockValidMessage = {
  channel: channelFixture.id,
  subtype: 'derp',
  text: 'what is lunchly',
  type: 'message',
  user: '10001'
};

test.afterEach.always('resetting stubs', () => {
  sandbox.resetHistory();
});

test.serial('it subscribes to the RTM client\'s "message" events', t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  t.deepEqual(rtm.on.args[0][0], 'message');
  t.is(typeof rtm.on.args[0][1], 'function');
});

test.serial('it calls some action for valid interaction messages', async t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  const messageHandler = rtm.on.args[0][1];
  await messageHandler(mockValidMessage);
  t.deepEqual(stubAction.args, [
    [
      { appState, message: mockValidMessage }
    ]
  ]);
});

test.serial('it ignores its own messages', async t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  const messageHandler = rtm.on.args[0][1];
  await messageHandler({ ...mockValidMessage, user: rtm.activeUserId });
  t.deepEqual(stubAction.args, []);
});

test.serial('it ignores messages from bots', async t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  const messageHandler = rtm.on.args[0][1];
  await messageHandler({ ...mockValidMessage, subtype: 'bot_message' });
  t.deepEqual(stubAction.args, []);
});

test.serial('it fires a tracking event for valid interaction messages', async t => {
  const appState = getAppState();
  const { clients: { rtm } } = appState;
  queryTodaysLunch({ action: stubAction, appState });
  const messageHandler = rtm.on.args[0][1];
  await messageHandler(mockValidMessage);
  t.deepEqual(stubTracker.track.args, [
    [
      'New interaction detected.',
      {
        activeUserId: mockRTMClient.activeUserId,
        channel: mockValidMessage.channel,
        listener: 'QUERY_ABOUT',
        messageType: mockValidMessage.type,
        messageUser: mockValidMessage.user,
        text: mockValidMessage.text
      }
    ]
  ]);
});
