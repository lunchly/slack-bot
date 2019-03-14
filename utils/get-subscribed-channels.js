const fetchAllChannels = require('./fetch-all-channels');
const transformChannels = require('./transform-channels');

module.exports = async webClient => {
  const response = await fetchAllChannels(webClient, {
    exclude_archived: true,
    types: 'public_channel'
  });

  const [ allChannels ] = response;
  const channels = allChannels
    .filter(channel => channel.is_member)
    .reduce(transformChannels, {});

  return channels;
};
