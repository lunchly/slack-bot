const { expect } = require('chai');
const initialState = require('./initial-state');

describe('initial state', () => {
  it('exports an object to use as the initial state', () => {
    expect(Object.keys(initialState)).to.deep.equal([
      'clients',
      'endpoints',
      'sites',
      'subscribedChannels'
    ]);
  });
});

