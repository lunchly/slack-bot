const { expect } = require('chai');
const isTrue = require('./is-true');

describe('validators/isTrue()', () => {
  it('returns true for truthy values', () => {
    expect(isTrue(true)).to.be.true;
  });

  it('returns false for other values', () => {
    [
      'no',
      false,
      'false',
      0
    ].forEach(value => {
      expect(isTrue(value)).to.be.false;
    });
  });
});
