import proxyquire from 'proxyquire';
import sinon from 'sinon';
import test from 'ava';

import channelFixture from './_fixtures/channel-sf';

const mockSites = [ { channel: 'sf', zeroCaterID: 'abc123' } ];
const mockSubscribedChannels = [ channelFixture ];
const stubGetSites = sinon.stub().returns(mockSites);
const stubGetSubscribedChannels = sinon.stub().resolves(mockSubscribedChannels);
const stubGetAllListeners = sinon.stub().resolves([ () => {} ]);
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
    './utils/get-all-listeners': stubGetAllListeners,
    './utils/get-sites': stubGetSites,
    './utils/get-subscribed-channels': stubGetSubscribedChannels
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

test('it starts the RTM client', t => {
  t.is(stubStart.calledOnce, true);
});
