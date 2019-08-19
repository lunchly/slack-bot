const { expect } = require('chai');
const isToday = require('./is-today');

describe('validators/isToday()', () => {
  it('returns true for today', () => {
    const timestamp = new Date();
    expect(isToday(timestamp)).to.be.true;
  });

  it('returns false for another day', () => {
    const timestamp = new Date('July 16, 1969, 6:32 AM GMT-7');
    expect(isToday(timestamp)).to.be.false;
  });
});
