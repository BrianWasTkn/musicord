/**
 * BrianWasTkn / DisTube 2020
 * A function that converts time to formatted durations
*/

import moment from 'moment';

/** if either: h, m, or s is less than 10 */
const format = i => {
  if (i < 10) return `0${i}`;
  return `${i}`;
}

/** Converts MS to hh:mm:ss */
export const formatDuration = ms => {
  if (!ms || !parseInt(ms)) return '00:00';
  const seconds = moment.duration(ms).seconds(),
  minutes = moment.duration(ms).minutes(),
  hours = moment.duration(ms).hours();

  if (hours > 0) return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  if (minutes > 0) return `${format(minutes)}:${format(seconds)}`;
  return `00:${format(seconds)}`;
}

/** Converts hh:mm:ss to seconds */
export const formatToSecond = str => {
  if (!str) return;
  if (typeof str !== 'string') return parseInt(str);
  let h = 0, m = 0, s = 0;
  if (str.match(/:/g)) {
    let time = str.split(':');
    if (time.length === 2) {
      m = parseInt(time[0], 10);
      s = parseInt(time[1], 10);
    } else if (time.length === 3) {
      h = parseInt(time[0], 10);
      m = parseInt(time[1], 10);
      s = parseInt(time[2], 10);
    } 
  } else { s = parseInt(str, 10) }
  return h * 60 * 60 + m * 60 + s;
}