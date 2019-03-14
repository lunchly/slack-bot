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

module.exports = transformChannels;
