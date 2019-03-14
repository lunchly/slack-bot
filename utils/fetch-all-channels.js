const fetchAllChannels = async (webClient, options) => {
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

module.exports = fetchAllChannels;
