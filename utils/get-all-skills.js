const path = require('path');
const globby = require('globby');

/**
 * Get all skill modules as an array of functions.
 * @param {object} options Custom options for the skills loader.
 * @returns {array}
 */
const getAllSkills = async options => {
  const { basePath } = options;
  const paths = await globby([ 'skills/*.js' ]);
  const skills = paths.map(modulePath => {
    return require(path.resolve(basePath, modulePath));
  });

  return skills;
};

module.exports = getAllSkills;
