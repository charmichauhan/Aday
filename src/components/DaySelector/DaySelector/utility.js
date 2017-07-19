import _ from 'lodash';

const DAY_NAME_LETTER_MAP = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};
const MONTH_NAME_LETTER_MAP = {
  jan: 'JAN',
  feb: 'FEB',
  mar: 'MAR',
  apr: 'APR',
  may: 'MAY',
  jun: 'JUN',
  jul: 'JUL',
  aug: 'AUG',
  sep: 'SEP',
  oct: 'OCT',
  nov: 'NOV',
  dec: 'DEC'
};
export function getSubStringFromDayName(dayName) {
  return _.get(DAY_NAME_LETTER_MAP, dayName.toLowerCase(), '');
}
export function getCapitalMonthName(monthName) {
  return _.get(MONTH_NAME_LETTER_MAP, monthName.toLowerCase(), '');
}
