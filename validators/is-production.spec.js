const { expect } = require('chai');
const isProduction = require('./is-production');

const invalidEnvironments = [
  'dev',
  'development',
  'test'
];

describe('validators/isProduction()', () => {
  it('returns true in production', () => {
    const environment = 'production';
    expect(isProduction(environment)).to.be.true;
  });

  it('returns false for allother environments', () => {
    invalidEnvironments.forEach(environment => {
      process.env = environment;
      expect(isProduction(environment)).to.be.false;
    });
  });
});
