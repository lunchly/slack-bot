const path = require('path');
const globby = require('globby');

/**
 * Get all listener modules as an array of functions.
 * @param {object} options Custom options for the skills loader.
 * @returns {array} Returns an array containing all skill functions.
 */
const getAllListeners = async options => {
  const { basePath } = options;
  const paths = await globby([ 'listeners/*.js' ]);
  const skills = paths.map(modulePath => {
    return require(path.resolve(basePath, modulePath));
  });

  return skills;
};

module.exports = getAllListeners;