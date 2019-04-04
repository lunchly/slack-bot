const allSites = require('../sites.json');

const transformSites = (sites, site) => {
  const { channel, company_id: companyId } = site;

  sites[channel] = {
    channel,
    companyId
  };

  return sites;
};

module.exports = () => {
  return allSites.reduce(transformSites, {});
};
