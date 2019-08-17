/**
 * Sets a Date object to midnight.
 * @param {Date} date The Date object to update.
 * @returns {Date} The updated Date object.
 */
const setDateToMidnight = date => {
  date.setHours(0, 0, 0, 0);
};

module.exports = setDateToMidnight;
