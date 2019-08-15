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

test('reduces multiple channels to a single dictionary', t => {
  const breakroomChannel = {
    id: 'TWEI7XP8B',
    is_archived: false,
    is_channel: true,
    is_member: true,
    is_mpim: false,
    is_private: false,
    name: 'breakroom',
    name_normalized: 'The Breakroom'
  };

  const channels = [
    channelFixture,
    breakroomChannel
  ].reduce(transformChannels, {});

  t.deepEqual(channels, {
    [breakroomChannel.id]: transformChannels({}, breakroomChannel)[breakroomChannel.id],
    [channelFixture.id]: transformChannels({}, channelFixture)[channelFixture.id]
  });
});
