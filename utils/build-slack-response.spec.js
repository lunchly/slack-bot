const { expect } = require('chai');
const buildSlackResponse = require('./build-slack-response');

const defaultProps = {
  channel: 'dogs',
  mealURL: 'https://www.doggomealdelivery.com/meals/fake-meal-link',
  mealsHyperlinkURL: 'https://www.doggomealdelivery.com/meals',
  text: 'Today\'s meal was brought to you by: Dog.',
  vendorImageURL: 'https://placedog.net/500',
  vendorName: 'Haut Dogs'
};

describe('utils/build-slack-response()', () => {
  it('posts the message to the proper channel', () => {
    expect(buildSlackResponse(defaultProps).channel).to.equal(defaultProps.channel);
  });
});
