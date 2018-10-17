const { today } = require('@lunchly/service-zerocrater');
const { ZEROCRATER_MEALS_URL } = require('../constants');

module.exports = controller => {
  controller.hears([ '^!lunch' ], 'direct_message,direct_mention', async (bot, event) => {
    const companyId = controller.config.zerocrater_company_id;
    const {
      id,
      name,
      vendor_name: vendorName,
      vendor_image_url: vendorImageURL,
      vendor_description: vendorDescription
    } = await today(companyId);

    const mealsURL = ZEROCRATER_MEALS_URL.replace('{companyId}', companyId);
    const mealURL = `${mealsURL}/${id}`;

    const messageTemplate = `Today's lunch is *${name}*, brought to you by *${vendorName}* — _${vendorDescription}_`;

    bot.reply(event, {
      text: messageTemplate,
      attachments: [
        {
          fallback: `View all meals at ${mealsURL}`,
          title: `${name}, from ${vendorName}`,
          callback_id: 'lunchInteractions',
          attachment_type: 'default',
          actions: [
            {
              name: 'aboutMeal',
              text: 'About This Meal',
              url: mealURL,
              type: 'button'
            },
            {
              name: 'upcomingMeals',
              text: 'Upcoming Meals',
              url: mealsURL,
              type: 'button'
            }
          ],
          image_url: vendorImageURL
        }
      ]
    });
  });
};
