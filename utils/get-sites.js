const allSites = require('../sites.json');

const transformSites = (sites = {}, site) => {
  const { admin, channel, company_id: companyId } = site;

  sites[channel] = {
    admin,
    channel,
    companyId
  };

  return sites;
};

module.exports = () => {
  return allSites.reduce(transformSites, {});
};
