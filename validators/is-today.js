const setDateToMidnight = require('../utils/set-date-to-midnight');

/**
 * Validate that a date object is set to today.
 * @param {Date} date The date to check.
 * @returns {Boolean} The result of the check.
 */
const isToday = date => {
  const now = new Date();
  return setDateToMidnight(date) === setDateToMidnight(now);
};

module.exports = isToday;
