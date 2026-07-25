import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

// All displayed dates/times default to Central regardless of viewer's device timezone.
export const CENTRAL_TIMEZONE = 'America/Chicago';

export const centralTime = (value) =>
  value === undefined ? dayjs().tz(CENTRAL_TIMEZONE) : dayjs(value).tz(CENTRAL_TIMEZONE);

export const formatCentral = (value, format) => centralTime(value).format(format);
