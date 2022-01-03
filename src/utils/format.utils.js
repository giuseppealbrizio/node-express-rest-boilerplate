import currency from 'currency.js';
import { toNumber } from 'lodash';

// const DATE = '2021/12/31';
// const PRICE = '1000.00';

/**
 * This function format a value and return currency formatting
 * @param value
 * @return {string}
 */
export const formatValueToEuro = (value) => {
  return currency(value, {
    symbol: '€',
    decimal: ',',
    separator: '.',
  }).format();
};

/**
 * This function format a value to a number using lodash
 * @param value
 * @return {number}
 */
export const formatValueToNumber = (value) => {
  return toNumber(value);
};

/**
 * This function format a value to a fixed 2 digits number
 * @param value
 * @return {string}
 */
export const formatValueToFixed = (value) => {
  return parseFloat(value).toFixed(2);
};

// const examples = {
//   date: new Intl.DateTimeFormat('it-IT').format(birthDate),
//   dateNotFormatted: birthDate,
//   jsMultiply: object.amount * 1.22,
//   jsAdd: toNumber(object.amount) + 1.22,
//   currencyAdd: parseFloat(currency(object.amount).add('1000.00')).toFixed(2),
//   currencyMultiply: currency(object.amount).multiply(1.22),
//   currencyParse: parseFloat(currency(object.amount).multiply(1.22)).toFixed(2),
//   testFormattingEuro: formatValueToEuro(permit.amount * 1.22),
// };
