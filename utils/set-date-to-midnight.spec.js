const { expect } = require('chai');
const setDateToMidnight = require('./set-date-to-midnight');

describe('utils/setDateToMidnight()', () => {
  it('sets the date to midnight', () => {
    const date = new Date('July 17, 1969 13:32:00 GMT-4');
    setDateToMidnight(date);
    expect(date.getHours()).to.equal(0);
  });
});
