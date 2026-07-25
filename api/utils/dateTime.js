const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const advancedFormat = require('dayjs/plugin/advancedFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// All displayed dates/times default to Central regardless of server timezone (Heroku runs UTC).
const CENTRAL_TIMEZONE = 'America/Chicago';

const centralTime = (value) =>
  value === undefined ? dayjs().tz(CENTRAL_TIMEZONE) : dayjs(value).tz(CENTRAL_TIMEZONE);

const formatCentral = (value, format) => centralTime(value).format(format);

module.exports = { CENTRAL_TIMEZONE, centralTime, formatCentral };
