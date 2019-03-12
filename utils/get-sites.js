const allSites = require('../sites.json');

const transformSites = (sites = {}, site) => {
  const { admin, channel, zeroCaterID } = site;

  sites[channel] = {
    admin,
    channel,
    zeroCaterID
  };

  return sites;
};

module.exports = () => {
  return allSites.reduce(transformSites, {});
};
