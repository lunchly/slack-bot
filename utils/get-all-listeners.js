const path = require('path');
const globby = require('globby');

/**
 * Get all listener modules as an array of functions.
 * @param {object} options Custom options for the listener loader.
 * @returns {array} Returns an array containing all listener functions.
 */
const getAllListeners = async options => {
  const { basePath } = options;
  const paths = await globby([ 'listeners/*.js' ]);
  const listeners = paths.map(modulePath => {
    return require(path.resolve(basePath, modulePath));
  });

  return listeners;
};

module.exports = getAllListeners;
