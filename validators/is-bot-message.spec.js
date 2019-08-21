const { expect } = require('chai');
const isBotMessage = require('./is-bot-message');

const ignoredSubtypes = [
  'channel_archive',
  'channel_join',
  'channel_leave',
  'channel_name',
  'channel_purpose',
  'channel_topic',
  'channel_unarchive',
  'ekm_access_denied',
  'file_comment',
  'file_mention',
  'file_share',
  'group_archive',
  'group_join',
  'group_leave',
  'group_name',
  'group_purpose',
  'group_topic',
  'group_unarchive',
  'me_message',
  'message_changed',
  'message_deleted',
  'message_replied',
  'pinned_item',
  'reply_broadcast',
  'thread_broadcast',
  'unpinned_item'
];

describe('validators/isBotMessage()', () => {
  it('returns true for bot_message subtypes', () => {
    expect(isBotMessage({
      subtype: 'bot_message'
    })).to.be.true;
  });

  it('returns false for all ignored subtypes', () => {
    ignoredSubtypes.forEach(subtype => {
      expect(isBotMessage({ subtype })).to.be.false;
    });
  });
});
