/**
 * Return an array of dates passing two dates
 * @param startDate
 * @param endDate
 * @returns {*[]}
 */
export const getDatesBetweenDates = (startDate, endDate) => {
  let dates = [];

  // to avoid modifying the original date
  const currentDate = new Date(startDate);

  while (currentDate < new Date(endDate)) {
    dates = [...dates, new Date(currentDate)];
    currentDate.setDate(currentDate.getDate() + 1);
  }
  dates = [...dates, endDate];
  return dates;
};

/**
 * Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
 * but by using 0 as the day it will give us the last day of the prior
 * month. So passing in 1 as the month number will return the last day
 * of January, not February
 * @param month
 * @param year
 * @returns {number}
 */
export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

/**
 * This function return the days between two dates
 * @param date1
 * @param date2
 * @return {number}
 */
export const calculateDays = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;

  const startDate = new Date(date1);
  const endDate = new Date(date2);
  return Math.round(Math.abs(startDate - endDate) / oneDay) + 1;
};

/**
 * This function format date to IT locale
 * @param date
 * @return {string}
 */
export const formatDateToItLocale = (date) => {
  return new Intl.DateTimeFormat('it-IT').format(date);
};

/**
 * Checks if the passed date is today
 * @param date
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};
