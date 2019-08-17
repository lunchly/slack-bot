import test from 'ava';

import breakroomChannelFixture from '../_fixtures/channel-breakroom';
import sfChannelFixture from '../_fixtures/channel-sf';
import transformChannels from './transform-channels';

test('it converts all object keys to camelCase', t => {
  const transfomedChannels = transformChannels({}, sfChannelFixture);
  t.deepEqual(Object.keys(transfomedChannels[sfChannelFixture.id]), [
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

test('reduces multiple channels to a single dictionary', t => {
  const channels = [
    breakroomChannelFixture,
    sfChannelFixture
  ].reduce(transformChannels, {});

  t.deepEqual(channels, {
    [breakroomChannelFixture.id]: transformChannels({}, breakroomChannelFixture)[breakroomChannelFixture.id],
    [sfChannelFixture.id]: transformChannels({}, sfChannelFixture)[sfChannelFixture.id]
  });
});
