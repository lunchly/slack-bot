import test from 'ava';
import proxyquire from 'proxyquire';
import { stub } from 'sinon';

const token = 'TEST_MP_TOKEN';
process.env.MIXPANEL_TOKEN = token;

const stubMixpanel = { init: stub() };
proxyquire
  .noCallThru()
  .load('./tracker', {
    mixpanel: stubMixpanel
  });

test('it initializes Mixpanel with the correct env variable', t => {
  t.deepEqual(stubMixpanel.init.args, [ [ token ] ]);
});
