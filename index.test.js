import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'ava';

import constants from './constants';
import channelFixture from './_fixtures/channel.fixture';

const { ENDPOINTS } = constants;

const mockSites = [ { channel: 'sf', zeroCaterID: 'abc123' } ];
const stubGetSites = sinon.stub().returns(mockSites);
const mockSubscribedChannels = [ channelFixture ];
const stubGetSubscribedChannels = sinon.stub().resolves(mockSubscribedChannels);
const stubRTMClientConstructor = sinon.stub();
const stubStart = sinon.stub();
const stubTodaysLunch = sinon.stub().resolves({});
const stubWebClientConstructor = sinon.stub();

const mockInfoLogLevel = 'mock-info-log-level';

class mockRTMClient {
  constructor(token, options) {
    stubRTMClientConstructor(token, options);
  }
}
mockRTMClient.prototype.start = stubStart;

class mockWebClient {
  constructor(token) {
    stubWebClientConstructor(token);
  }
}

/* eslint-disable no-unused-vars */
const slackBot = proxyquire
  .noCallThru()
  .load('./index', {
    '@slack/client': {
      LogLevel: {
        INFO: mockInfoLogLevel
      },
      RTMClient: mockRTMClient,
      WebClient: mockWebClient
    },
    './initial-state': {},
    './todays-lunch': stubTodaysLunch,
    './utils/get-subscribed-channels': stubGetSubscribedChannels,
    './utils/get-sites': stubGetSites
  }).default;
/* eslint-enable no-unused-vars */

test('it instantiates the RTM client with the Slack API token', t => {
  t.deepEqual(stubRTMClientConstructor.args, [
    [
      'test',
      { logLevel: mockInfoLogLevel }
    ]
  ]);
});

test('it instantiates the Web client with the Slack API token', t => {
  t.deepEqual(stubWebClientConstructor.args, [
    [ 'test' ]
  ]);
});

test('loads each plugin with the expected app state', t => {
  const expectedAppState = {
    endpoints: ENDPOINTS,
    sites: mockSites,
    subscribedChannels: mockSubscribedChannels
  };
  const { appState } = stubTodaysLunch.args[0][0];
  t.deepEqual(appState, expectedAppState);
});

test('it starts the RTM client', t => {
  t.is(stubStart.calledOnce, true);
});
