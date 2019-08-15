import test from 'ava';

import channelFixture from '../_fixtures/channel.fixture';
import transformChannels from './transform-channels';

test('it converts all object keys to camelCase', t => {
  const transfomedChannels = transformChannels({}, channelFixture);
  t.deepEqual(Object.keys(transfomedChannels[channelFixture.id]), [
    'id',
    'isArchived',
    'isChannel',
    'isMember',
    'isMPIM',
    'isPrivate',
    'name',
    'normalizedName'
  ]);
});
