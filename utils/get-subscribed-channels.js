const getAllChannels = async (webClient, options) => {
  async function pageLoaded(accumulatedChannels, res) {
    const mergedChannels = [ ...accumulatedChannels, res.channels ];
    const hasNextPage = res.response_metadata &&
      res.response_metadata.channels &&
      res.response_metadata.next_cursor !== '';

    if (hasNextPage) {
      const pageOptions = { ...options };
      pageOptions.cursor = res.response_metadata.next_cursor;

      return pageLoaded(
        mergedChannels,
        await webClient.channels.list(pageOptions)
      );
    }

    return mergedChannels;
  }

  return pageLoaded([], await webClient.channels.list(options));
};

const transformChannels = (channels = {}, channel) => {
  const {
    id,
    is_archived: isArchived,
    is_channel: isChannel,
    is_member: isMember,
    is_mpim: isMPIM,
    is_private: isPrivate,
    name,
    name_normalized: normalizedName
  } = channel;

  channels[id] = {
    id,
    isArchived,
    isChannel,
    isMember,
    isMPIM,
    isPrivate,
    name,
    normalizedName
  };

  return channels;
};

module.exports = async webClient => {
  const response = await getAllChannels(webClient, {
    exclude_archived: true,
    types: 'public_channel'
  });

  const [ allChannels ] = response;
  const channels = allChannels
    .filter(channel => channel.is_member)
    .reduce(transformChannels, {});

  return channels;
};
