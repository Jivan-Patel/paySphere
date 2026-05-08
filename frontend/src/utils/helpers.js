/**
 * Formats a date string to a human-readable format.
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Truncates a string to a specified length.
 * @param {string} str 
 * @param {number} num 
 * @returns {string}
 */
export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};
