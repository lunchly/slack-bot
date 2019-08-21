const { expect } = require('chai');
const proxyquire = require('proxyquire');
const { stub } = require('sinon');

const token = 'TEST_MP_TOKEN';
process.env.MIXPANEL_TOKEN = token;

const stubMixpanel = { init: stub() };
proxyquire
  .noCallThru()
  .load('./tracker', {
    mixpanel: stubMixpanel
  });

describe('tracker()', () => {
  it('initializes Mixpanel with the correct env variable', () => {
    expect(stubMixpanel.init.args).to.deep.equal([ [ token ] ]);
  });
});
