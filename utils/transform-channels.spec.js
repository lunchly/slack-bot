const { expect } = require('chai');

const breakroomChannelFixture = require('../_fixtures/channel-breakroom');
const sfChannelFixture = require('../_fixtures/channel-sf');
const transformChannels = require('./transform-channels');

describe('utils/transformChannel()', () => {
  it('converts all object keys to camelCase', () => {
    const transfomedChannels = transformChannels({}, sfChannelFixture);
    expect(Object.keys(transfomedChannels[sfChannelFixture.id])).to.deep.equal([
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

  it('reduces multiple channels to a single dictionary', () => {
    const channels = [
      breakroomChannelFixture,
      sfChannelFixture
    ].reduce(transformChannels, {});

    expect(channels).to.deep.equal({
      [breakroomChannelFixture.id]: transformChannels({}, breakroomChannelFixture)[breakroomChannelFixture.id],
      [sfChannelFixture.id]: transformChannels({}, sfChannelFixture)[sfChannelFixture.id]
    });
  });
});
