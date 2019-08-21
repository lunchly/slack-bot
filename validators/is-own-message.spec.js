const { expect } = require('chai');
const isOwnMessage = require('./is-own-message');

describe('validators/isOwnMessage()', () => {
  it('returns true for messages made by the current user', () => {
    const user = '0189f66d';
    const message = { user };
    expect(isOwnMessage(message, user)).to.be.true;
  });

  it('returns false messages made by other users', () => {
    const message = { user: '158024ae0e5f' };
    expect(isOwnMessage(message, 'another-user')).to.be.false;
  });
});
